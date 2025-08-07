type DocumentTypes =
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.oasis.opendocument.text'

type ImageTypes = 'image/jpeg' | 'image/png' | 'image/jpg' | 'image/webp'

export type DocExtractClientOptions = {
  allowedImages?: ImageTypes[]
  allowedDocuments?: DocumentTypes[]
}

export type Document = {
  filename: string
  type: DocumentTypes | ImageTypes
  url?: string
  contents?: Buffer
}

export class DocExtract {
  // Private Members
  private allowedImages: ImageTypes[]
  private allowedDocuments: DocumentTypes[]

  // Constuctor
  constructor(options?: DocExtractClientOptions) {
    this.allowedImages = options?.allowedImages || ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    this.allowedDocuments = options?.allowedDocuments || [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text'
    ]
  }

  // Public Methods
  public async extractText(document: Document): Promise<string> {
    if (!document.url && !document.contents) {
      throw new Error('Document must have a url or contents')
    }

    // Check if the type is a document type
    const isDocumentType = this.allowedDocuments.includes(document.type as DocumentTypes)
    // Check if the type is an image type
    const isImageType = this.allowedImages.includes(document.type as ImageTypes)

    if (!isDocumentType && !isImageType) {
      throw new Error(
        `File type '${document.type}' is not allowed. Allowed types: ${[...this.allowedDocuments, ...this.allowedImages].join(', ')}`
      )
    }

    return 'Document extracted'
  }
}
