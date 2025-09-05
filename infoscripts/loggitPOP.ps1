$renameMap = @{}
$fileStats = @{}

function Resolve-File($file) {
    while ($renameMap.ContainsKey($file)) {
        $file = $renameMap[$file]
    }
    return $file
}

$commitLines = git log --numstat --summary --pretty=format:"COMMIT:%H" | Where-Object { $_ -ne "" }

$currentCommit = ""
$filesTouched = @{}

foreach ($line in $commitLines) {
    if ($line -match "^COMMIT:(.+)$") {
        $currentCommit = $matches[1]
        $filesTouched.Clear()
        continue
    }

    if ($line -match "rename (.+?) => (.+?)$") {
        $old = $matches[1].Trim()
        $new = $matches[2].Trim()
        $renameMap[$old] = $new
        continue
    }

    if ($line -match "^(\d+|-)\t(\d+|-)\t(.+)$") {
        $addedRaw = $matches[1]
        $deletedRaw = $matches[2]
        $fileRaw = $matches[3]

        if ($addedRaw -eq "-" -or $deletedRaw -eq "-") { continue }

        $added = [int]$addedRaw
        $deleted = [int]$deletedRaw
        $file = Resolve-File($fileRaw)

        if (-not $fileStats.ContainsKey($file)) {
            $fileStats[$file] = @{Added=0; Deleted=0; Changes=0; Commits=0}
        }

        $fileStats[$file].Added += $added
        $fileStats[$file].Deleted += $deleted
        $fileStats[$file].Changes += ($added + $deleted)

        if (-not $filesTouched.ContainsKey($file)) {
            $filesTouched[$file] = $true
            $fileStats[$file].Commits += 1
        }
    }
}

# Sort by total line changes
$sortedStats = $fileStats.GetEnumerator() | Sort-Object { $_.Value.Changes } -Descending
$logPath = "git_file_stats.txt"

"File Modification Summary (Sorted by Total Line Changes)" | Out-File $logPath
"--------------------------------------------------------" | Out-File $logPath -Append

foreach ($entry in $sortedStats) {
    $file = $entry.Key
    $stats = $entry.Value
    "$file`tAdded: $($stats.Added)`tDeleted: $($stats.Deleted)`tTotal Lines Changed: $($stats.Changes)`tCommits: $($stats.Commits)" | Out-File $logPath -Append
}

Write-Host "Saved detailed file history to: $logPath"
