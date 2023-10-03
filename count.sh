#!/bin/bash

# asked phindai to make a script to count total project lines written in project *.mjs files

# Initialize the total line count to 0
total_lines=0

# Use the find command to find all .mjs files in the current directory and its subdirectories
# Then, iterate over each file, count the number of lines, and add it to the total
cd engine
while read -r file; do
  lines=$(wc -l < "$file")
  total_lines=$((total_lines + lines))
  echo "$file: $lines lines"
done < <(find . -type f -name "*.mjs")
cd ../game
while read -r file; do
  lines=$(wc -l < "$file")
  total_lines=$((total_lines + lines))
  echo "$file: $lines lines"
done < <(find . -type f -name "*.mjs")

# Print the total line count
echo "Total lines: $total_lines"
