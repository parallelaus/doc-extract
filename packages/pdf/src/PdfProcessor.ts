// Import types directly from the core package using relative paths
import type { Document, ExtractedText } from '../../core/src/lib/types.js'
import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js'

// Import pdf-parse with proper default import
import pdfParse from 'pdf-parse-debugging-disabled'

/**
 * PDF document processor implementation
 */
export class PdfProcessor implements DocumentProcessor {
  /**
   * The MIME type this processor handles
   */
  public readonly supportedMimeType = 'application/pdf'

  /**
   * Process a PDF document and extract text
   * @param document The PDF document to process
   * @returns Extracted text from the PDF document
   */
  public async process(document: Document): Promise<ExtractedText> {
    if (!document.contents) {
      // Get the file from the url
      const response = await fetch(document.url!)
      if (!response.ok) {
        throw new Error(`Error retrieveing PDF from URL: ${document.url}`)
      }

      if (!response.headers.get('content-type')?.startsWith('application/pdf')) {
        throw new Error(`URL ${document.url} does not point to a PDF file`)
      }

      document.contents = Buffer.from(await response.arrayBuffer())
    }

    try {
      // Use pdf-parse to extract text from the PDF
      const pdfData = await pdfParse(document.contents)

      return { text: pdfData.text }
    } catch (error: unknown) {
      // Handle error properly with type checking
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to extract text from PDF: ${errorMessage}`)
    }
  }
}
