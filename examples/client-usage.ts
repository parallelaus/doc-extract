/**
 * Example showing how to use the doc-extract modular architecture
 * 
 * This demonstrates how clients can selectively import only the processors they need,
 * minimizing dependencies.
 */

// Import the core package
import { DocExtract } from '@parallelsoftware/doc-extract'

// Import only the processors you need
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf'
import { DocxProcessor } from '@parallelsoftware/doc-extract-docx'
// import { ImageProcessor } from '@parallelsoftware/doc-extract-image' // Uncomment if needed

async function main() {
  // Create an instance of DocExtract
  const docExtract = new DocExtract()

  // Register only the processors you need
  docExtract.registerProcessor(new PdfProcessor())
  docExtract.registerProcessor(new DocxProcessor())
  // docExtract.registerProcessor(new ImageProcessor()) // Uncomment if needed

  console.log('Supported document types:', docExtract.getSupportedMimeTypes())

  try {
    // Process a PDF document
    const pdfText = await docExtract.extract({
      filename: 'example.pdf',
      type: 'application/pdf',
      contents: Buffer.from('PDF content here') // In a real app, this would be a PDF buffer
    })
    
    console.log('Extracted text from PDF:', pdfText)

    // Process a DOCX document
    const docxText = await docExtract.extract({
      filename: 'example.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      contents: Buffer.from('DOCX content here') // In a real app, this would be a DOCX buffer
    })
    
    console.log('Extracted text from DOCX:', docxText)
  } catch (error) {
    console.error('Error extracting text:', error)
  }
}

main().catch(console.error)
