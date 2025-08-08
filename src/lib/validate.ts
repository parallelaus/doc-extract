/**
 * Utility functions for doc-extract
 */
import { z } from 'zod'
import { Document, DocumentTypes, ImageTypes, DocExtractClientOptions, documentSchema } from './types.js'
import { getDocumentType } from './utils.js'

/**
 * Validates if a string is a valid URL
 * @param value String to validate
 * @returns True if the string is a valid URL, false otherwise
 */
export const isValidUrl = (value: string): boolean => {
  try {
    // Use global URL constructor
    new globalThis.URL(value)
    return true
  } catch {
    return false
  }
}

export async function validateDocument(
  document: Document,
  allowedDocuments: DocumentTypes[],
  allowedImages: ImageTypes[]
): Promise<Document> {
  // Validate document structure
  const validatedDocument = validateDocumentStructure(document, documentSchema)

  // Check if document type is allowed
  if (!validatedDocument.type) {
    // Get the content-type from headers
    validatedDocument.type = await getDocumentType(validatedDocument.url!)
  }

  // Validate document type
  return validateDocumentType(validatedDocument, allowedDocuments, allowedImages)
}

/**
 * Validates the structure of a document
 * @param document The document to validate
 * @param documentSchema Zod schema for document validation
 * @throws Error if document structure is invalid
 * @returns The validated document
 */
export const validateDocumentStructure = (document: Document, documentSchema: z.ZodType<Document>): Document => {
  // Validate document with schema
  const validatedDocument = documentSchema.parse(document)
  // Check if document has a source (url or contents)
  if (!validatedDocument.url && !validatedDocument.contents) {
    throw new Error('Document must have a url or contents')
  }

  // If contents (Buffer) is provided, filename and type are required
  if (validatedDocument.contents) {
    if (!validatedDocument.filename) {
      throw new Error('Filename is required when providing document contents')
    }
    if (!validatedDocument.type) {
      throw new Error('Type is required when providing document contents')
    }
  }

  return validatedDocument
}

/**
 * Validates if a document type is allowed
 * @param document The document to validate
 * @param allowedDocuments List of allowed document MIME types
 * @param allowedImages List of allowed image MIME types
 * @throws Error if document type is not allowed
 * @returns True if the document type is allowed
 */
export const validateDocumentType = (
  document: Document,
  allowedDocuments: DocumentTypes[],
  allowedImages: ImageTypes[]
): Document => {
  // If no type is provided, we can't validate it
  if (!document.type) {
    throw new Error('Document type not provided, can not validate document type.')
  }
  // Check if the type is a document type
  const isDocumentType = allowedDocuments.includes(document.type as DocumentTypes)
  // Check if the type is an image type
  const isImageType = allowedImages.includes(document.type as ImageTypes)

  if (!isDocumentType && !isImageType) {
    throw new Error(
      `File type '${document.type}' is not allowed. Allowed types: ${[...allowedDocuments, ...allowedImages].join(', ')}`
    )
  }

  return document
}

/**
 * Validates client options and returns default values for missing options
 * @param options Optional client options to validate
 * @param clientOptionsSchema Zod schema for client options validation
 * @returns Validated client options with default values applied
 */
export const validateClientOptions = (
  options: DocExtractClientOptions | undefined,
  clientOptionsSchema: z.ZodType<DocExtractClientOptions>
): {
  allowedImages: ImageTypes[]
  allowedDocuments: DocumentTypes[]
} => {
  // Validate options with schema if provided
  const validatedOptions = options ? clientOptionsSchema.parse(options) : undefined
  // Return validated options with defaults applied
  return {
    allowedImages: validatedOptions?.allowedImages || ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    allowedDocuments: validatedOptions?.allowedDocuments || [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text'
    ]
  }
}
