import { validateDocument, validateClientOptions } from './validate.js'
import { DocExtractClientOptions, Document, docExtractClientOptionsSchema } from './types.js'
import { DocumentProcessor } from './DocumentProcessor.js'

export class DocExtract {
  // Private Members
  private processors: Map<string, DocumentProcessor> = new Map()

  // Constructor
  constructor(options?: DocExtractClientOptions) {
    // Validate options using the utility function
    validateClientOptions(options, docExtractClientOptionsSchema)
    // We're not storing options since they're not used yet
    // Will be used in future for configuration
  }

  /**
   * Register a document processor
   * @param processor The document processor to register
   */
  public registerProcessor(processor: DocumentProcessor): void {
    this.processors.set(processor.supportedMimeType, processor)
  }

  /**
   * Check if a document type is supported
   * @param mimeType The MIME type to check
   * @returns True if the MIME type is supported, false otherwise
   */
  public supportsDocumentType(mimeType: string): boolean {
    return this.processors.has(mimeType)
  }

  /**
   * Get all registered processor MIME types
   * @returns Array of supported MIME types
   */
  public getSupportedMimeTypes(): string[] {
    return Array.from(this.processors.keys())
  }

  /**
   * Extract text from a document
   * @param document The document to extract text from
   * @returns Extracted text from the document
   */
  public async extract(document: Document): Promise<string> {
    // Validate the document against registered processors
    const validatedDocument = await validateDocument(document, this.getSupportedMimeTypes())

    // Get the appropriate processor
    const processor = this.processors.get(validatedDocument.type)
    if (!processor) {
      throw new Error(`No processor registered for document type: ${validatedDocument.type}`)
    }

    // Process the document
    return processor.process(validatedDocument)
  }
}
