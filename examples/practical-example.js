/**
 * Practical example for @parallelsoftware/doc-extract
 * 
 * This example demonstrates a real-world use case:
 * A simple document processing script that extracts text from multiple
 * document types in a directory and saves the extracted text to output files.
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
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

/**
 * Process all documents in a directory
 * @param {string} inputDir - Directory containing documents to process
 * @param {string} outputDir - Directory to save extracted text
 */
async function processDirectory(inputDir, outputDir) {
  // Initialize DocExtract
  const docExtract = new DocExtract();
  
  // Register document processors
  docExtract.registerProcessor(new PdfProcessor());
  docExtract.registerProcessor(new DocxProcessor());
  docExtract.registerProcessor(new ImageProcessor());
  
  console.log('Supported document types:', docExtract.getSupportedMimeTypes());
  
  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  // Get all files in the input directory
  const files = await fs.readdir(inputDir);
  
  console.log(`Found ${files.length} files in ${inputDir}`);
  
  // Process each file
  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const fileExt = path.extname(file).toLowerCase();
    const mimeType = mimeTypeMap[fileExt];
    
    // Skip files with unsupported extensions
    if (!mimeType || !docExtract.supportsDocumentType(mimeType)) {
      console.log(`Skipping unsupported file: ${file}`);
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
      
      // Save extracted text to output file
      const outputPath = path.join(outputDir, `${path.basename(file, fileExt)}.txt`);
      await fs.writeFile(outputPath, extractedText);
      
      console.log(`✓ Extracted text saved to ${outputPath}`);
    } catch (error) {
      console.error(`✗ Error processing ${file}: ${error.message}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Define input and output directories
    const inputDir = path.join(__dirname, 'sample-files');
    const outputDir = path.join(__dirname, 'extracted-text');
    
    // Create sample directory if it doesn't exist
    await fs.mkdir(inputDir, { recursive: true });
    
    // Check if sample directory is empty
    const files = await fs.readdir(inputDir);
    if (files.length === 0) {
      console.log('Sample directory is empty. Creating sample text file...');
      
      // Create a sample text file
      await fs.writeFile(
        path.join(inputDir, 'sample.txt'),
        'This is a sample text file for testing document extraction.'
      );
      
      console.log('Please add some PDF, DOCX, or image files to the sample-files directory.');
      return;
    }
    
    // Process all documents in the directory
    await processDirectory(inputDir, outputDir);
    
    console.log('\nDocument processing complete!');
    console.log(`Processed files from: ${inputDir}`);
    console.log(`Extracted text saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
main();
