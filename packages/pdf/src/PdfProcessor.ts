// Import types directly from the core package using relative paths
import type { Document } from '../../core/src/lib/types.js'
import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js'

// Import pdf-parse with proper default import
import pdfParse from 'pdf-parse'

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
  public async process(document: Document): Promise<string> {
    if (!document.contents) {
      throw new Error('PDF document must have contents')
    }

    try {
      // Use pdf-parse to extract text from the PDF
      const pdfData = await pdfParse(document.contents)
      return pdfData.text
    } catch (error: unknown) {
      // Handle error properly with type checking
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to extract text from PDF: ${errorMessage}`)
    }
  }
}
