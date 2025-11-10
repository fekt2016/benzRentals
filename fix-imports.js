#!/usr/bin/env node
/**
 * Script to fix import paths after restructuring
 * Run: node fix-imports.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const replacements = [
  // Hooks - within features, use local
  { pattern: /from ['"]\.\.\/hooks\/(use\w+)['"]/g, replacement: 'from "./$1"' },
  // Services - within features, use local  
  { pattern: /from ['"]\.\.\/services\/(\w+Api)['"]/g, replacement: 'from "./$1Service"' },
  // Components - update paths
  { pattern: /from ['"]\.\.\/components\/ui\/(\w+)['"]/g, replacement: 'from "../../components/ui/$1"' },
  { pattern: /from ['"]\.\.\/components\/forms\/(\w+)['"]/g, replacement: 'from "../../features/bookings/Form"' },
  { pattern: /from ['"]\.\.\/components\/Modal\/(\w+)['"]/g, replacement: 'from "../../components/ui/$1"' },
  { pattern: /from ['"]\.\.\/components\/Cards\/(\w+)['"]/g, replacement: 'from "../../features/cars/$1"' },
  // Layout
  { pattern: /from ['"]\.\.\/Layout\/(\w+)['"]/g, replacement: 'from "../../components/layout/$1"' },
  // Routes
  { pattern: /from ['"]\.\.\/routes\/(\w+)['"]/g, replacement: 'from "../../config/constants"' },
  // Utils
  { pattern: /from ['"]\.\.\/utils\/(\w+)['"]/g, replacement: 'from "../../utils/$1"' },
  // Styles
  { pattern: /from ['"]\.\.\/styles\/(\w+)['"]/g, replacement: 'from "../../styles/$1"' },
];

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ pattern, replacement }) => {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const featuresDir = path.join(__dirname, 'src/features');
if (fs.existsSync(featuresDir)) {
  const files = walkDir(featuresDir);
  let fixed = 0;
  files.forEach(file => {
    if (fixImportsInFile(file)) {
      fixed++;
      console.log(`Fixed: ${file}`);
    }
  });
  console.log(`\nFixed ${fixed} files`);
} else {
  console.log('Features directory not found');
}

