/**
 * Advanced usage example for @parallelsoftware/doc-extract
 * 
 * This example demonstrates more advanced features:
 * 1. Error handling and validation
 * 2. Processing documents from URLs
 * 3. Batch processing multiple documents
 * 4. Custom document processor implementation
 */

// Import the core DocExtract class
import { DocExtract } from '@parallelsoftware/doc-extract';

// Import document processors - wrapped in try/catch to handle missing dependencies
let PdfProcessor, DocxProcessor;
try {
  const pdfModule = await import('@parallelsoftware/doc-extract-pdf');
  PdfProcessor = pdfModule.PdfProcessor;
} catch (error) {
  console.log('PDF processor not available:', error.message);
}

try {
  const docxModule = await import('@parallelsoftware/doc-extract-docx');
  DocxProcessor = docxModule.DocxProcessor;
} catch (error) {
  console.log('DOCX processor not available:', error.message);
}

// Import Node.js modules
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Import Node.js modules

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Custom TXT document processor implementation
 * Shows how to create your own document processor
 */
class TxtProcessor {
  constructor() {
    this.supportedMimeType = 'text/plain';
  }
  
  async process(document) {
    if (!document.contents) {
      throw new Error('TXT document must have contents');
    }
    
    // Simply convert Buffer to string for text files
    return document.contents.toString('utf-8');
  }
}

/**
 * Helper function to load a document from a file
 */
async function loadDocumentFromFile(filePath, mimeType) {
  const contents = await fs.readFile(filePath);
  return {
    filename: path.basename(filePath),
    type: mimeType,
    contents
  };
}

/**
 * Helper function to load a document from a URL
 */
async function loadDocumentFromUrl(url, mimeType) {
  // In a real application, you would fetch the file from the URL
  // For this example, we'll simulate it with a local file
  return {
    url,
    type: mimeType,
    // Note: In a real application, you would fetch the contents from the URL
    // and provide them as a Buffer. For this example, we're leaving contents
    // undefined to demonstrate URL-based processing (which would be implemented
    // in the actual processors)
  };
}

/**
 * Process multiple documents in batch
 */
async function batchProcess(docExtract, documents) {
  const results = [];
  
  for (const doc of documents) {
    try {
      const text = await docExtract.extract(doc);
      results.push({
        filename: doc.filename || doc.url || 'unknown',
        success: true,
        text: text.substring(0, 100) + '...' // Truncate for display
      });
    } catch (error) {
      results.push({
        filename: doc.filename || doc.url || 'unknown',
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

async function main() {
  try {
    // Initialize DocExtract with options
    const docExtract = new DocExtract({
      // Options can be added here as needed
    });
    
    // Register standard processors if available
    if (PdfProcessor) {
      try {
        docExtract.registerProcessor(new PdfProcessor());
      } catch (error) {
        console.log('Failed to register PDF processor:', error.message);
      }
    }
    
    if (DocxProcessor) {
      try {
        docExtract.registerProcessor(new DocxProcessor());
      } catch (error) {
        console.log('Failed to register DOCX processor:', error.message);
      }
    }
    
    // Register custom processor
    docExtract.registerProcessor(new TxtProcessor());
    
    console.log('Registered processors:', docExtract.getSupportedMimeTypes());
    
    // Example 1: Error handling with validation
    console.log('\n--- Example 1: Error Handling ---');
    try {
      // Attempt to process an unsupported document type
      const invalidDocument = {
        filename: 'invalid.xyz',
        type: 'application/xyz', // Unsupported type
        contents: Buffer.from('test content')
      };
      
      await docExtract.extract(invalidDocument);
    } catch (error) {
      console.log('Expected error caught:', error.message);
    }
    
    // Example 2: Process a document from a URL
    console.log('\n--- Example 2: URL-based Document ---');
    // Note: In a real application, this would be a real URL
    // For this example, we're simulating with a local reference
    const urlDocument = await loadDocumentFromUrl(
      'https://example.com/sample.pdf',
      'application/pdf'
    );
    
    console.log('URL document:', {
      url: urlDocument.url,
      type: urlDocument.type
    });
    console.log('Note: Actual URL processing would be implemented in the processor');
    
    // Example 3: Custom TXT processor
    console.log('\n--- Example 3: Custom TXT Processor ---');
    const txtPath = path.join(__dirname, 'sample-files', 'sample.txt');
    
    // Create sample.txt if it doesn't exist
    try {
      await fs.access(txtPath);
    } catch {
      await fs.mkdir(path.dirname(txtPath), { recursive: true });
      await fs.writeFile(txtPath, 'This is a sample text file.\nIt contains multiple lines.\nThe TXT processor extracts this text.');
    }
    
    const txtDocument = await loadDocumentFromFile(txtPath, 'text/plain');
    const txtText = await docExtract.extract(txtDocument);
    console.log('TXT Text:', txtText);
    
    // Example 4: Batch processing
    console.log('\n--- Example 4: Batch Processing ---');
    
    // Create sample files directory if it doesn't exist
    const sampleDir = path.join(__dirname, 'sample-files');
    try {
      await fs.access(sampleDir);
    } catch {
      await fs.mkdir(sampleDir, { recursive: true });
    }
    
    // Prepare sample documents
    const documents = [];
    
    // Only add PDF document if processor is available
    if (PdfProcessor) {
      try {
        const pdfDoc = await loadDocumentFromFile(
          path.join(__dirname, 'sample-files', 'sample.pdf'),
          'application/pdf'
        ).catch(() => ({
          filename: 'sample.pdf',
          type: 'application/pdf',
          contents: Buffer.from('Sample PDF content') // Placeholder
        }));
        documents.push(pdfDoc);
      } catch (error) {
        console.log('Skipping PDF document:', error.message);
      }
    }
    
    // Only add DOCX document if processor is available
    if (DocxProcessor) {
      try {
        const docxDoc = await loadDocumentFromFile(
          path.join(__dirname, 'sample-files', 'sample.docx'),
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ).catch(() => ({
          filename: 'sample.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          contents: Buffer.from('Sample DOCX content') // Placeholder
        }));
        documents.push(docxDoc);
      } catch (error) {
        console.log('Skipping DOCX document:', error.message);
      }
    }
    
    // TXT document - always available since we have a custom processor
    documents.push(txtDocument);
    
    // Invalid document (for error handling demonstration)
    documents.push({
      filename: 'invalid.xyz',
      type: 'application/xyz',
      contents: Buffer.from('Invalid content')
    });
    
    // Process all documents in batch
    const batchResults = await batchProcess(docExtract, documents);
    
    // Display batch results
    console.log('Batch processing results:');
    console.table(batchResults);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the example
main();
