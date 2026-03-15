param(
  [string]$ProjectRoot = (Get-Location).Path,
  [string]$Email,
  [string]$Password,
  [int]$Count = 5
)

$ErrorActionPreference = "Stop"

function Read-DotEnv([string]$Path) {
  $map = @{}
  if (!(Test-Path $Path)) { return $map }
  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if (!$line -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $k = $line.Substring(0, $idx).Trim()
    $v = $line.Substring($idx + 1).Trim().Trim('"')
    $map[$k] = $v
  }
  return $map
}

$envFile = Join-Path $ProjectRoot ".env.local"
$envMap = Read-DotEnv $envFile

$supabaseUrl = $envMap["NEXT_PUBLIC_SUPABASE_URL"]
$anonKey = $envMap["NEXT_PUBLIC_SUPABASE_ANON_KEY"]

if (!$supabaseUrl -or !$anonKey) {
  throw "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in $envFile"
}

if (!$Email) { $Email = Read-Host "Supabase auth email" }
if (!$Password) { $Password = Read-Host "Supabase auth password" }

Write-Host "Supabase smoke submit ($Count each) to $supabaseUrl"

function Invoke-JsonPost([string]$Uri, [hashtable]$Headers, [object]$Body) {
  Invoke-RestMethod -Method Post -Uri $Uri -Headers $Headers -ContentType "application/json" -Body ($Body | ConvertTo-Json -Depth 10)
}

function Invoke-JsonInsert([string]$Table, [hashtable]$Headers, [object]$Row) {
  $uri = ($supabaseUrl.TrimEnd("/") + "/rest/v1/" + $Table)
  Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers -ContentType "application/json" -Body ($Row | ConvertTo-Json -Depth 10)
}

$authHeaders = @{ "apikey" = $anonKey }

$token = Invoke-JsonPost ($supabaseUrl.TrimEnd("/") + "/auth/v1/token?grant_type=password") $authHeaders @{ email = $Email; password = $Password }

$accessToken = $token.access_token
if (!$accessToken) { throw "Could not get access token (check email/password and that Email auth is enabled in Supabase)." }

$user = Invoke-RestMethod -Method Get -Uri ($supabaseUrl.TrimEnd("/") + "/auth/v1/user") -Headers @{ "apikey" = $anonKey; "Authorization" = "Bearer $accessToken" }

$userId = $user.id
if (!$userId) { throw "Could not fetch user id." }

$dbHeaders = @{ "apikey" = $anonKey; "Authorization" = "Bearer $accessToken"; "Prefer" = "return=minimal" }

$results = @()

for ($i = 1; $i -le $Count; $i++) {
  $suffix = [Guid]::NewGuid().ToString("N").Substring(0, 8)

  try {
    Invoke-JsonInsert "businesses" $dbHeaders @{
      user_id = $userId
      approval_status = "pending"
      company_name = "Test Business $suffix"
      owner_name = "Test Owner $suffix"
      country = "Germany"
      city = "Berlin"
      industry = "Other"
      sub_industry = $null
      description = "Automated smoke test submission."
      phone = $null
      address = $null
      other_locations = $null
      locations_description = $null
      offerings = $null
      offerings_description = $null
      website = $null
      email = "test+$suffix@example.com"
    } | Out-Null
    $results += [pscustomobject]@{ kind="business"; ok=$true; i=$i; detail="ok" }
  } catch {
    $results += [pscustomobject]@{ kind="business"; ok=$false; i=$i; detail=$_.Exception.Message }
  }

  try {
    Invoke-JsonInsert "cultural_clubs" $dbHeaders @{
      user_id = $userId
      approval_status = "pending"
      club_name = "Test Cultural Club $suffix"
      contact_name = "Test Contact $suffix"
      country = "Germany"
      city = "Berlin"
      description = "Automated smoke test submission."
      phone = $null
      address = $null
      website = $null
      email = "test+$suffix@example.com"
      focus_areas = "Culture"
      activities = "Meetups"
      facebook = $null
      instagram = $null
    } | Out-Null
    $results += [pscustomobject]@{ kind="cultural-club"; ok=$true; i=$i; detail="ok" }
  } catch {
    $results += [pscustomobject]@{ kind="cultural-club"; ok=$false; i=$i; detail=$_.Exception.Message }
  }

  try {
    Invoke-JsonInsert "sport_clubs" $dbHeaders @{
      user_id = $userId
      approval_status = "pending"
      club_name = "Test Sport Club $suffix"
      contact_name = "Test Contact $suffix"
      country = "Germany"
      city = "Berlin"
      sport = "Football"
      description = "Automated smoke test submission."
      phone = $null
      address = $null
      website = $null
      email = "test+$suffix@example.com"
      training_schedule = "Tue 19:00"
      age_groups = "Adults"
      league = $null
      facebook = $null
      instagram = $null
    } | Out-Null
    $results += [pscustomobject]@{ kind="sport-club"; ok=$true; i=$i; detail="ok" }
  } catch {
    $results += [pscustomobject]@{ kind="sport-club"; ok=$false; i=$i; detail=$_.Exception.Message }
  }
}

$summary = $results | Group-Object kind | ForEach-Object {
  $ok = ($_.Group | Where-Object {$_.ok}).Count
  $fail = ($_.Group | Where-Object {!$_.ok}).Count
  [pscustomobject]@{ kind=$_.Name; ok=$ok; fail=$fail }
}

Write-Host ""
Write-Host "Summary:"
$summary | Format-Table -AutoSize

$failed = $results | Where-Object {!$_.ok}
if ($failed.Count -gt 0) {
  Write-Host ""
  Write-Host "Failures:"
  $failed | Select-Object kind,i,detail | Format-List
  exit 1
}

Write-Host ""
Write-Host "All submissions inserted as pending. Approve them in /admin to make them public."