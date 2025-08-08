import { z } from 'zod'
import { isValidUrl, validateDocument, validateClientOptions } from './validate'

// Schema definitions
const documentTypesEnum = z.enum([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text'
])

const imageTypesEnum = z.enum(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])

const docExtractClientOptionsSchema = z.object({
  allowedImages: z.array(imageTypesEnum).optional(),
  allowedDocuments: z.array(documentTypesEnum).optional()
})

const documentSchema = z.object({
  filename: z.string().optional(),
  type: z.string().optional(), // Accept any string for type, validation will be done separately
  url: z
    .string()
    .refine(val => !val || isValidUrl(val), { message: 'Invalid URL format' })
    .optional(),
  contents: z.instanceof(Buffer).optional()
})

// Generate and export types from schemas
/**
 * Supported document MIME types
 */
export type DocumentTypes = z.infer<typeof documentTypesEnum>

/**
 * Supported image MIME types
 */
export type ImageTypes = z.infer<typeof imageTypesEnum>

/**
 * Client options for DocExtract constructor
 */
export type DocExtractClientOptions = z.infer<typeof docExtractClientOptionsSchema>

/**
 * Document object for text extraction
 */
export type Document = z.infer<typeof documentSchema>

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
  public async extractText(document: Document): Promise<string> {
    // Validate document using the utility function
    validateDocument(document, documentSchema, this.allowedDocuments, this.allowedImages)

    return 'Document extracted'
  }
}
