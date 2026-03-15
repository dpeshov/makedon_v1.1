param(
  [string]$BaseUrl = "http://localhost:3000",
  [int]$Count = 5
)

$ErrorActionPreference = "Stop"

function Post-Json([string]$Path, [hashtable]$Body) {
  $uri = ($BaseUrl.TrimEnd("/") + $Path)
  Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json" -Body ($Body | ConvertTo-Json -Depth 10)
}

Write-Host "Smoke submit to $BaseUrl (count=$Count)"

$results = @()

for ($i = 1; $i -le $Count; $i++) {
  $suffix = [Guid]::NewGuid().ToString("N").Substring(0, 8)

  try {
    $res = Post-Json "/api/businesses" @{
      company_name = "Test Business $suffix"
      owner_name = "Test Owner $suffix"
      country = "Germany"
      city = "Berlin"
      industry = "Other"
      sub_industry = ""
      description = "Automated smoke test submission."
      phone = ""
      address = ""
      other_locations = ""
      locations_description = ""
      offerings = ""
      offerings_description = ""
      website = ""
      email = "test+$suffix@example.com"
    }
    $results += [pscustomobject]@{ kind="business"; ok=$true; i=$i; detail=($res | ConvertTo-Json -Compress) }
  } catch {
    $results += [pscustomobject]@{ kind="business"; ok=$false; i=$i; detail=$_.Exception.Message }
  }

  try {
    $res = Post-Json "/api/cultural-clubs" @{
      club_name = "Test Cultural Club $suffix"
      contact_name = "Test Contact $suffix"
      country = "Germany"
      city = "Berlin"
      description = "Automated smoke test submission."
      phone = ""
      address = ""
      website = ""
      email = "test+$suffix@example.com"
      focus_areas = "Culture"
      activities = "Meetups"
      facebook = ""
      instagram = ""
    }
    $results += [pscustomobject]@{ kind="cultural-club"; ok=$true; i=$i; detail=($res | ConvertTo-Json -Compress) }
  } catch {
    $results += [pscustomobject]@{ kind="cultural-club"; ok=$false; i=$i; detail=$_.Exception.Message }
  }

  try {
    $res = Post-Json "/api/sport-clubs" @{
      club_name = "Test Sport Club $suffix"
      contact_name = "Test Contact $suffix"
      country = "Germany"
      city = "Berlin"
      sport = "Football"
      description = "Automated smoke test submission."
      phone = ""
      address = ""
      website = ""
      email = "test+$suffix@example.com"
      training_schedule = "Tue 19:00"
      age_groups = "Adults"
      league = ""
      facebook = ""
      instagram = ""
    }
    $results += [pscustomobject]@{ kind="sport-club"; ok=$true; i=$i; detail=($res | ConvertTo-Json -Compress) }
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
Write-Host "All submissions succeeded."

