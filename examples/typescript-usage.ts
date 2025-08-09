/**
 * TypeScript usage example for @parallelsoftware/doc-extract
 *
 * This example demonstrates how to use the package with TypeScript,
 * leveraging type definitions and Zod schemas.
 */

// Import the core DocExtract class and types
import { DocExtract, type Document, type DocumentProcessor } from '@parallelsoftware/doc-extract'

// Import document processors - using dynamic imports with try/catch in main function
// We'll conditionally import these to handle missing dependencies gracefully

// Import Node.js modules
import fs from 'node:fs/promises'
import { existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Custom CSV document processor implementation
 * Shows how to create your own document processor with TypeScript
 */
class CsvProcessor implements DocumentProcessor {
  public readonly supportedMimeType = 'text/csv'

  public async process(document: Document): Promise<string> {
    if (!document.contents) {
      throw new Error('CSV document must have contents')
    }

    const csvContent = document.contents.toString('utf-8')

    // Simple CSV to text conversion (in a real app, you'd use a CSV parser)
    const lines = csvContent.split('\n')
    return lines.map(line => line.replace(/,/g, ' | ')).join('\n')
  }
}

/**
 * Custom Text document processor implementation
 * For processing plain text files and fallback content
 */
class TextProcessor implements DocumentProcessor {
  public readonly supportedMimeType = 'text/plain'

  public async process(document: Document): Promise<string> {
    if (!document.contents) {
      throw new Error('Text document must have contents')
    }

    // Simply return the text content
    return document.contents.toString('utf-8')
  }
}

/**
 * Helper function to create a document object with proper typing
 */
async function createDocument(filePath: string, mimeType: string): Promise<Document> {
  const contents = await fs.readFile(filePath)

  return {
    filename: path.basename(filePath),
    type: mimeType,
    contents
  }
}

/**
 * Process a document and handle errors with TypeScript
 */
async function processDocument(
  docExtract: DocExtract,
  document: Document
): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const text = await docExtract.extract(document)
    return {
      success: true,
      text
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

async function main() {
  try {
    // Create a new DocExtract instance
    const docExtract = new DocExtract()
    console.log('DocExtract initialized')

    // Register document processors conditionally
    let PdfProcessor, DocxProcessor, ImageProcessor

    // Try to import PDF processor
    try {
      const pdfModule = await import('@parallelsoftware/doc-extract-pdf')
      PdfProcessor = pdfModule.PdfProcessor
      docExtract.registerProcessor(new PdfProcessor())
      console.log('PDF processor registered successfully')
    } catch (error) {
      console.log('PDF processor not available:', (error as Error).message)
    }

    // Try to import DOCX processor
    try {
      const docxModule = await import('@parallelsoftware/doc-extract-docx')
      DocxProcessor = docxModule.DocxProcessor
      docExtract.registerProcessor(new DocxProcessor())
      console.log('DOCX processor registered successfully')
    } catch (error) {
      console.log('DOCX processor not available:', (error as Error).message)
    }

    // Try to import Image processor
    try {
      const imageModule = await import('@parallelsoftware/doc-extract-image')
      ImageProcessor = imageModule.ImageProcessor
      docExtract.registerProcessor(new ImageProcessor())
      console.log('Image processor registered successfully')
    } catch (error) {
      console.log('Image processor not available:', (error as Error).message)
    }

    // Always register our custom CSV processor
    docExtract.registerProcessor(new CsvProcessor())

    // Always register our custom Text processor for fallback files
    docExtract.registerProcessor(new TextProcessor())

    // Log supported document types
    console.log('Supported document types:', docExtract.getSupportedMimeTypes())

    // Create sample files directory if it doesn't exist
    const sampleDir = path.join(__dirname, 'sample-files')
    try {
      await fs.access(sampleDir)
    } catch {
      await fs.mkdir(sampleDir, { recursive: true })
    }

    // Create a sample CSV file if it doesn't exist
    const csvPath = path.join(sampleDir, 'sample.csv')
    try {
      await fs.access(csvPath)
    } catch {
      const csvContent =
        'Name,Age,Email\n' +
        'John Doe,30,john@example.com\n' +
        'Jane Smith,25,jane@example.com\n' +
        'Bob Johnson,45,bob@example.com'

      await fs.writeFile(csvPath, csvContent)
    }

    // Process a CSV document using our custom processor
    console.log('\n--- Processing CSV with Custom Processor ---')

    // Create a strongly-typed document object
    const csvDocument = await createDocument(csvPath, 'text/csv')

    // Process the document with error handling
    const result = await processDocument(docExtract, csvDocument)

    if (result.success) {
      console.log('CSV Text:')
      console.log(result.text)
    } else {
      console.error('Error processing CSV:', result.error)
    }

    // Example: Check if a document type is supported
    const isSupported = docExtract.supportsDocumentType('text/csv')
    console.log('\nIs CSV supported?', isSupported)

    // Example: Process multiple documents with type safety
    console.log('\n--- Processing Multiple Documents ---')

    // Define document paths and types based on available processors
    const documents: Array<{ path: string; type: string }> = []

    // Only add PDF document if processor is available
    if (PdfProcessor) {
      documents.push({ path: path.join(sampleDir, 'sample.pdf'), type: 'application/pdf' })
    }

    // Always add CSV document since we have a custom processor
    documents.push({ path: path.join(sampleDir, 'sample.csv'), type: 'text/csv' })

    // Only add DOCX document if processor is available
    if (DocxProcessor) {
      documents.push({
        path: path.join(sampleDir, 'sample.docx'),
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
    }

    // Process each document with proper error handling
    for (const doc of documents) {
      console.log(`\nProcessing: ${path.basename(doc.path)}`)
      try {
        // Check if file exists before attempting to process
        if (!existsSync(doc.path)) {
          console.log(`File not found: ${doc.path}. Creating a placeholder file for demonstration.`)

          // Create a placeholder file with sample content based on type
          let content = ''
          if (doc.type === 'text/csv') {
            content = 'Name,Age,Email\nJohn Doe,30,john@example.com\nJane Smith,25,jane@example.com'
          } else if (doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            content = 'This is a placeholder for a DOCX file that would normally contain formatted text.'
          } else {
            content = `This is a placeholder for a ${doc.type} file.`
          }

          // For demonstration purposes, we'll create a text file and process it
          const placeholderPath = path.join(sampleDir, `placeholder-${path.basename(doc.path)}.txt`)
          writeFileSync(placeholderPath, content)

          // Process the placeholder instead
          const placeholderDoc = await createDocument(placeholderPath, 'text/plain')
          const text = await docExtract.extract(placeholderDoc)
          console.log(`Using placeholder! First 100 chars: ${text.substring(0, 100)}...`)
        } else {
          // Process the actual file
          const document = await createDocument(doc.path, doc.type)
          const text = await docExtract.extract(document)
          console.log(`Success! First 100 chars: ${text.substring(0, 100)}...`)
        }
      } catch (error) {
        console.error('Unexpected error:', error instanceof Error ? error.message : String(error))
      }
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error))
  }
}

// Run the example
main()
