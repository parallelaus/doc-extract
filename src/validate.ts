/**
 * Utility functions for doc-extract
 */
import { z } from 'zod'
import type { Document, DocumentTypes, ImageTypes, DocExtractClientOptions } from './index'

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

/**
 * Validates a document against allowed document and image types
 * @param document The document to validate
 * @param documentSchema Zod schema for document validation
 * @param allowedDocuments List of allowed document MIME types
 * @param allowedImages List of allowed image MIME types
 * @throws Error if document is invalid
 * @returns The validated document
 */
export const validateDocument = (
  document: Document,
  documentSchema: z.ZodType<Document>,
  allowedDocuments: DocumentTypes[],
  allowedImages: ImageTypes[]
): Document => {
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
  // If type is provided, validate it against allowed types
  if (validatedDocument.type) {
    // Check if the type is a document type
    const isDocumentType = allowedDocuments.includes(validatedDocument.type as DocumentTypes)
    // Check if the type is an image type
    const isImageType = allowedImages.includes(validatedDocument.type as ImageTypes)

    if (!isDocumentType && !isImageType) {
      throw new Error(
        `File type '${validatedDocument.type}' is not allowed. Allowed types: ${[...allowedDocuments, ...allowedImages].join(', ')}`
      )
    }
  }

  return validatedDocument
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
