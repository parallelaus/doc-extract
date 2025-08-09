import { Document, ExtractedText } from './types'

/**
 * Interface for document processors
 * All document type processors must implement this interface
 */
export interface DocumentProcessor {
  /**
   * The MIME type this processor handles
   */
  readonly supportedMimeType: string

  /**
   * Process a document and extract text
   * @param document The document to process
   * @returns Extracted text from the document
   */
  // eslint-disable-next-line no-unused-vars
  process(document: Document): Promise<ExtractedText>
}
