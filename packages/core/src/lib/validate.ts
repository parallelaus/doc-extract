/**
 * Utility functions for doc-extract
 */
import { z } from 'zod'
import { Document, DocExtractClientOptions, documentSchema } from './types.js'
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

/**
 * Validates a document against supported MIME types
 * @param document The document to validate
 * @param supportedMimeTypes List of supported MIME types
 * @returns The validated document
 */
export async function validateDocument(
  document: Document,
  supportedMimeTypes: string[]
): Promise<Document> {
  // Validate document structure
  const validatedDocument = validateDocumentStructure(document, documentSchema)

  // Check if document type is allowed
  if (!validatedDocument.type) {
    // Get the content-type from headers if URL is provided
    if (validatedDocument.url) {
      validatedDocument.type = await getDocumentType(validatedDocument.url)
    } else {
      throw new Error('Document type is required when URL is not provided')
    }
  }

  // Validate document type
  return validateDocumentType(validatedDocument, supportedMimeTypes)
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

  // Check if document has either URL or contents
  if (!validatedDocument.url && !validatedDocument.contents) {
    throw new Error('Document must have either URL or contents')
  }

  return validatedDocument
}

/**
 * Validates if a document type is supported
 * @param document The document to validate
 * @param supportedMimeTypes List of supported MIME types
 * @throws Error if document type is not supported
 * @returns The validated document
 */
export const validateDocumentType = (
  document: Document,
  supportedMimeTypes: string[]
): Document => {
  // Check if document type is supported
  if (!supportedMimeTypes.includes(document.type)) {
    throw new Error(`Document type '${document.type}' is not supported. Supported types: ${supportedMimeTypes.join(', ')}`)
  }

  return document
}

/**
 * Validates client options and returns default values for missing options
 * @param options Optional client options to validate
 * @param clientOptionsSchema Zod schema for client options validation
 * @returns Validated client options
 */
export const validateClientOptions = (
  options: DocExtractClientOptions | undefined,
  clientOptionsSchema: z.ZodType<DocExtractClientOptions>
): DocExtractClientOptions => {
  // Use default options if none provided
  const defaultOptions: DocExtractClientOptions = {}
  
  // Validate options with schema
  return clientOptionsSchema.parse(options || defaultOptions)
}
