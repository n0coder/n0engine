const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_FILE = 'js_project_contents.txt';
const EXTENSIONS = ['.js', '.mjs', '.json', '.html', '.css', '.jsx', '.ts', '.tsx'];
const SKIP_FOLDERS = ['node_modules', '.git', 'dist', 'build', '.vscode'];
const SKIP_FILES = [OUTPUT_FILE, '.gitignore'];

function shouldSkipPath(filePath) {
    return SKIP_FOLDERS.some(folder => filePath.includes(folder)) ||
           SKIP_FILES.some(file => filePath.endsWith(file));
}

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!shouldSkipPath(fullPath)) {
                getAllFiles(fullPath, fileList);
            }
        } else {
            const ext = path.extname(file);
            if (EXTENSIONS.includes(ext) && !shouldSkipPath(fullPath)) {
                fileList.push(fullPath);
            }
        }
    });
    
    return fileList;
}

function concatenateFiles() {
    console.log('Starting to concatenate JavaScript project files...');
    
    // Get all matching files
    const files = getAllFiles('.');
    console.log(`Found ${files.length} files to process`);
    
    // Create output file
    let output = `JavaScript Project Contents\n`;
    output += `Generated on: ${new Date().toLocaleString()}\n`;
    output += `${'='.repeat(50)}\n\n`;
    
    // Process each file
    files.forEach((filePath, index) => {
        console.log(`Processing (${index + 1}/${files.length}): ${filePath}`);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            output += `\n${'='.repeat(50)}\n`;
            output += `FILE: ${filePath}\n`;
            output += `${'='.repeat(50)}\n`;
            output += content;
            output += `\n\n`;
            
        } catch (error) {
            console.warn(`Could not read file ${filePath}: ${error.message}`);
            output += `\n${'='.repeat(50)}\n`;
            output += `FILE: ${filePath} (ERROR: Could not read)\n`;
            output += `${'='.repeat(50)}\n\n`;
        }
    });
    
    // Write output file
    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`\nDone! All file contents saved to ${OUTPUT_FILE}`);
    console.log(`Total files processed: ${files.length}`);
}

// Run the script
concatenateFiles();
