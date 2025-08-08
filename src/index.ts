import { z } from 'zod'

export const DocumentTypesEnum = z.enum([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text'
])
export type DocumentTypes = z.infer<typeof DocumentTypesEnum>

export const ImageTypesEnum = z.enum(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
export type ImageTypes = z.infer<typeof ImageTypesEnum>

export const DocExtractClientOptionsSchema = z.object({
  allowedImages: z.array(ImageTypesEnum).optional(),
  allowedDocuments: z.array(DocumentTypesEnum).optional()
})
export type DocExtractClientOptions = z.infer<typeof DocExtractClientOptionsSchema>

export const DocumentSchema = z.object({
  filename: z.string(),
  type: z.union([DocumentTypesEnum, ImageTypesEnum]),
  url: z.string().url().optional(),
  contents: z.instanceof(Buffer).optional()
})
export type Document = z.infer<typeof DocumentSchema>

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
