#!/usr/bin/env node

/**
 * CLI tool for @parallelsoftware/doc-extract
 * 
 * This example demonstrates how to build a command-line interface
 * for extracting text from various document types.
 * 
 * Usage:
 *   node cli-tool.js extract <file> [--output <output-file>]
 *   node cli-tool.js batch <directory> [--output <output-directory>]
 *   node cli-tool.js supported
 *   node cli-tool.js help
 */

// Import the core DocExtract class
import { DocExtract } from '@parallelsoftware/doc-extract';

// Import document processors
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf';
import { DocxProcessor } from '@parallelsoftware/doc-extract-docx';
import { ImageProcessor } from '@parallelsoftware/doc-extract-image';

// Import Node.js modules
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Map file extensions to MIME types
const mimeTypeMap = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.bmp': 'image/bmp'
};

/**
 * Initialize DocExtract with all available processors
 */
function initDocExtract() {
  const docExtract = new DocExtract();
  
  // Register all available processors
  docExtract.registerProcessor(new PdfProcessor());
  docExtract.registerProcessor(new DocxProcessor());
  docExtract.registerProcessor(new ImageProcessor());
  
  return docExtract;
}

/**
 * Extract text from a single file
 */
async function extractFile(filePath, outputPath = null) {
  const docExtract = initDocExtract();
  
  try {
    // Get file extension and MIME type
    const fileExt = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypeMap[fileExt];
    
    if (!mimeType) {
      console.error(`Unsupported file extension: ${fileExt}`);
      console.log('Supported extensions:', Object.keys(mimeTypeMap).join(', '));
      process.exit(1);
    }
    
    if (!docExtract.supportsDocumentType(mimeType)) {
      console.error(`No processor registered for MIME type: ${mimeType}`);
      console.log('Supported MIME types:', docExtract.getSupportedMimeTypes().join(', '));
      process.exit(1);
    }
    
    // Read file contents
    const contents = await fs.readFile(filePath);
    
    // Create document object
    const document = {
      filename: path.basename(filePath),
      type: mimeType,
      contents
    };
    
    console.log(`Extracting text from ${path.basename(filePath)}...`);
    
    // Extract text
    const extractedText = await docExtract.extract(document);
    
    // Output text
    if (outputPath) {
      await fs.writeFile(outputPath, extractedText);
      console.log(`Text extracted and saved to ${outputPath}`);
    } else {
      console.log('\n--- Extracted Text ---\n');
      console.log(extractedText);
      console.log('\n---------------------\n');
    }
    
    return extractedText;
  } catch (error) {
    console.error(`Error extracting text: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Process all files in a directory
 */
async function batchProcess(dirPath, outputDir = null) {
  const docExtract = initDocExtract();
  
  try {
    // Create output directory if specified
    if (outputDir) {
      await fs.mkdir(outputDir, { recursive: true });
    }
    
    // Get all files in the directory
    const files = await fs.readdir(dirPath);
    
    console.log(`Found ${files.length} files in ${dirPath}`);
    
    let processedCount = 0;
    let skippedCount = 0;
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      // Skip directories
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        console.log(`Skipping directory: ${file}`);
        skippedCount++;
        continue;
      }
      
      // Get file extension and MIME type
      const fileExt = path.extname(file).toLowerCase();
      const mimeType = mimeTypeMap[fileExt];
      
      // Skip unsupported file types
      if (!mimeType || !docExtract.supportsDocumentType(mimeType)) {
        console.log(`Skipping unsupported file: ${file}`);
        skippedCount++;
        continue;
      }
      
      try {
        console.log(`Processing ${file}...`);
        
        // Read file contents
        const contents = await fs.readFile(filePath);
        
        // Create document object
        const document = {
          filename: file,
          type: mimeType,
          contents
        };
        
        // Extract text
        const extractedText = await docExtract.extract(document);
        
        // Save extracted text if output directory is specified
        if (outputDir) {
          const outputPath = path.join(outputDir, `${path.basename(file, fileExt)}.txt`);
          await fs.writeFile(outputPath, extractedText);
          console.log(`✓ Saved to ${outputPath}`);
        } else {
          console.log(`✓ Extracted ${extractedText.length} characters`);
        }
        
        processedCount++;
      } catch (error) {
        console.error(`✗ Error processing ${file}: ${error.message}`);
        skippedCount++;
      }
    }
    
    console.log('\nBatch processing complete!');
    console.log(`Processed: ${processedCount} files`);
    console.log(`Skipped: ${skippedCount} files`);
    
    if (outputDir) {
      console.log(`Output saved to: ${outputDir}`);
    }
  } catch (error) {
    console.error(`Error during batch processing: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Show supported document types
 */
function showSupportedTypes() {
  const docExtract = initDocExtract();
  const supportedMimeTypes = docExtract.getSupportedMimeTypes();
  
  console.log('Supported MIME types:');
  supportedMimeTypes.forEach(type => console.log(`- ${type}`));
  
  console.log('\nSupported file extensions:');
  Object.entries(mimeTypeMap)
    .filter(([_, mimeType]) => supportedMimeTypes.includes(mimeType))
    .forEach(([ext]) => console.log(`- ${ext}`));
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Doc Extract CLI Tool
-------------------

Extract text from various document types using @parallelsoftware/doc-extract.

Commands:
  extract <file> [--output <output-file>]
    Extract text from a single file
    
  batch <directory> [--output <output-directory>]
    Process all supported files in a directory
    
  supported
    Show supported document types and file extensions
    
  help
    Show this help message

Examples:
  node cli-tool.js extract document.pdf
  node cli-tool.js extract document.pdf --output extracted.txt
  node cli-tool.js batch ./documents --output ./extracted-text
  `);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'extract': {
      if (args.length < 2) {
        console.error('Error: Missing file path');
        console.log('Usage: node cli-tool.js extract <file> [--output <output-file>]');
        process.exit(1);
      }
      
      const filePath = args[1];
      let outputPath = null;
      
      // Check for output option
      const outputIndex = args.indexOf('--output');
      if (outputIndex !== -1 && args.length > outputIndex + 1) {
        outputPath = args[outputIndex + 1];
      }
      
      extractFile(filePath, outputPath);
      break;
    }
    
    case 'batch': {
      if (args.length < 2) {
        console.error('Error: Missing directory path');
        console.log('Usage: node cli-tool.js batch <directory> [--output <output-directory>]');
        process.exit(1);
      }
      
      const dirPath = args[1];
      let outputDir = null;
      
      // Check for output option
      const outputIndex = args.indexOf('--output');
      if (outputIndex !== -1 && args.length > outputIndex + 1) {
        outputDir = args[outputIndex + 1];
      }
      
      batchProcess(dirPath, outputDir);
      break;
    }
    
    case 'supported':
      showSupportedTypes();
      break;
    
    case 'help':
      showHelp();
      break;
    
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Run the CLI
parseArgs();
