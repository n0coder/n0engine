# Initialize counters
$totalLines = 0
$totalCharacters = 0
$scriptCount = 0

# Function to process a directory
function Process-Directory($path) {
    Set-Location -Path $path -ErrorAction Stop
    Get-ChildItem -Recurse -Filter "*.mjs" | ForEach-Object {
        try {
            $lines = (Get-Content $_.FullName -ErrorAction Stop | Measure-Object -Line).Lines
            $characters = (Get-Content $_.FullName -Raw -ErrorAction Stop).Length
            $modifiedDate = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
            # Increment global counters
            $script:totalLines += $lines
            $script:totalCharacters += $characters
            $script:scriptCount += 1
            # Output file details
            Write-Host "File: $($_.FullName)"
            Write-Host "Last Modified: $modifiedDate"
            Write-Host "Total lines: $lines ($($script:totalLines))"
            Write-Host "Total characters: $characters ($($script:totalCharacters))"
            Write-Host ""
        } catch {
            Write-Warning "Error processing $($_.FullName): $_"
        }
    }
}

# Process directories
try {
    Process-Directory "engine"
    Process-Directory "../game"
} catch {
    Write-Error "Failed to process directory: $_"
    exit 1
}

# Calculate averages
$averageLines = if ($scriptCount -gt 0) { $totalLines / $scriptCount } else { 0 }
$averageCharacters = if ($scriptCount -gt 0) { $totalCharacters / $scriptCount } else { 0 }

# Print results
Write-Host "Average lines per script: $averageLines"
Write-Host "Average characters per script: $averageCharacters"
Write-Host "Total Scripts: $scriptCount"
Write-Host "Total lines: $totalLines"
Write-Host "Total characters: $totalCharacters"
