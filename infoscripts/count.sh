#!/bin/bash

# asked phindai to make a script to count total project lines written in project *.mjs files
# Initialize the total line count, total character count, and script count to 0
total_lines=0
total_characters=0
script_count=0

# Use the find command to find all .mjs files in the current directory and its subdirectories
# Then, iterate over each file, count the number of lines and characters, and add them to the totals
# Also, increment the script count each time we encounter a new script
cd engine
while read -r file; do
 lines=$(wc -l < "$file")
 characters=$(wc -m < "$file")
 total_lines=$((total_lines + lines))
 total_characters=$((total_characters + characters))
 script_count=$((script_count + 1))
 echo "Total lines $file: $lines ($total_lines)"
 echo "Total characters $file: $characters ($total_characters)"
done < <(find . -type f -name "*.mjs")
cd ../game
while read -r file; do
 lines=$(wc -l < "$file")
 characters=$(wc -m < "$file")
 total_lines=$((total_lines + lines))
 total_characters=$((total_characters + characters))
 script_count=$((script_count + 1))
 echo "Total lines $file: $lines ($total_lines)"
 echo "Total characters $file: $characters ($total_characters)"
done < <(find . -type f -name "*.mjs")

# Calculate and print the averages
average_lines=$((total_lines / script_count))
average_characters=$((total_characters / script_count))
echo "Average lines per script: $average_lines"
echo "Average characters per script: $average_characters"

# Print the total line and character counts
echo "Total Scripts: $script_count"
echo "Total lines: $total_lines"
echo "Total characters: $total_characters"
