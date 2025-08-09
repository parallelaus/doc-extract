import { DocExtractClientOptions, Document } from './types.js'
import { DocumentProcessor } from './DocumentProcessor.js'
export declare class DocExtract {
  private processors
  constructor(options?: DocExtractClientOptions)
  /**
   * Register a document processor
   * @param processor The document processor to register
   */
  registerProcessor(processor: DocumentProcessor): void
  /**
   * Check if a document type is supported
   * @param mimeType The MIME type to check
   * @returns True if the MIME type is supported, false otherwise
   */
  supportsDocumentType(mimeType: string): boolean
  /**
   * Get all registered processor MIME types
   * @returns Array of supported MIME types
   */
  getSupportedMimeTypes(): string[]
  /**
   * Extract text from a document
   * @param document The document to extract text from
   * @returns Extracted text from the document
   */
  extract(document: Document): Promise<string>
}
//# sourceMappingURL=DocExtract.d.ts.map
