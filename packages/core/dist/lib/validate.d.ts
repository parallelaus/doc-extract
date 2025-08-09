/**
 * Utility functions for doc-extract
 */
import { z } from 'zod'
import { Document, DocExtractClientOptions } from './types.js'
/**
 * Validates if a string is a valid URL
 * @param value String to validate
 * @returns True if the string is a valid URL, false otherwise
 */
export declare const isValidUrl: (value: string) => boolean
/**
 * Validates a document against supported MIME types
 * @param document The document to validate
 * @param supportedMimeTypes List of supported MIME types
 * @returns The validated document
 */
export declare function validateDocument(document: Document, supportedMimeTypes: string[]): Promise<Document>
/**
 * Validates the structure of a document
 * @param document The document to validate
 * @param documentSchema Zod schema for document validation
 * @throws Error if document structure is invalid
 * @returns The validated document
 */
export declare const validateDocumentStructure: (document: Document, documentSchema: z.ZodType<Document>) => Document
/**
 * Validates if a document type is supported
 * @param document The document to validate
 * @param supportedMimeTypes List of supported MIME types
 * @throws Error if document type is not supported
 * @returns The validated document
 */
export declare const validateDocumentType: (document: Document, supportedMimeTypes: string[]) => Document
/**
 * Validates client options and returns default values for missing options
 * @param options Optional client options to validate
 * @param clientOptionsSchema Zod schema for client options validation
 * @returns Validated client options
 */
export declare const validateClientOptions: (
  options: DocExtractClientOptions | undefined,
  clientOptionsSchema: z.ZodType<DocExtractClientOptions>
) => DocExtractClientOptions
//# sourceMappingURL=validate.d.ts.map
