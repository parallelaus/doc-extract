/**
 * Basic usage example for @parallelsoftware/doc-extract
 *
 * This example demonstrates how to:
 * 1. Import and instantiate DocExtract
 * 2. Register a custom document processor
 * 3. Extract text from a text file
 */

// Import the core DocExtract class
import { DocExtract } from '@parallelsoftware/doc-extract'

// Import fs module for reading files
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom text processor for demonstration purposes
class TextProcessor {
  constructor() {
    this.supportedMimeType = 'text/plain'
  }

  // Process method required by DocumentProcessor interface
  async process(document) {
    if (document.type !== this.supportedMimeType) {
      throw new Error(`Unsupported document type: ${document.type}`)
    }

    // For text files, simply return the content as a string
    return document.contents.toString('utf-8')
  }
}

async function main() {
  try {
    // Create a new DocExtract instance
    const docExtract = new DocExtract()
    console.log('DocExtract initialized')

    // Register our custom text processor
    docExtract.registerProcessor(new TextProcessor())

    // Log supported document types
    console.log('Supported document types:', docExtract.getSupportedMimeTypes())

    // Example: Extract text from a text file
    console.log('\n--- Example: Text File Extraction ---')
    const textPath = path.join(__dirname, 'sample-files', 'sample.txt')
    const textBuffer = await fs.readFile(textPath)

    const textDocument = {
      filename: 'sample.txt',
      type: 'text/plain',
      contents: textBuffer
    }

    const extractedText = await docExtract.extract(textDocument)
    console.log('Extracted Text:\n', extractedText)

    // Demonstrate error handling with unsupported file type
    console.log('\n--- Example: Error Handling ---')
    try {
      const unsupportedDocument = {
        filename: 'unknown.xyz',
        type: 'application/unknown',
        contents: Buffer.from('This is an unsupported file type')
      }

      await docExtract.extract(unsupportedDocument)
    } catch (error) {
      console.log('Expected error caught:', error.message)
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Run the example
main()
