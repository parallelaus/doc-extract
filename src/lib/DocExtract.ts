import { validateDocument, validateClientOptions } from './validate.js'
import { DocumentTypes, ImageTypes, DocExtractClientOptions, Document, docExtractClientOptionsSchema } from './types.js'

export class DocExtract {
  // Private Members
  private allowedImages: ImageTypes[]
  private allowedDocuments: DocumentTypes[]

  // Constructor
  constructor(options?: DocExtractClientOptions) {
    // Validate options using the utility function
    const validatedOptions = validateClientOptions(options, docExtractClientOptionsSchema)
    this.allowedImages = validatedOptions.allowedImages
    this.allowedDocuments = validatedOptions.allowedDocuments
  }

  // Public Methods
  public async extract(document: Document): Promise<string> {
    // Validate the document
    const validatedDocument = await validateDocument(document, this.allowedDocuments, this.allowedImages)

    switch (validatedDocument.type) {
      // Process Documents
      case 'application/pdf':
        break
      case 'application/msword':
        break
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        break
      case 'application/vnd.oasis.opendocument.text':
        break

      // Process Images
      case 'image/jpeg':
        break
      case 'image/png':
        break
      case 'image/jpg':
        break
      case 'image/webp':
        break

      default:
        throw new Error('Document type not supported.')
    }

    return 'Document extracted'
  }
}
