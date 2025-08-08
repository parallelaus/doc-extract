import { z } from 'zod'
import { isValidUrl } from './validate.js'

// Schema definitions
export const documentTypesEnum = z.enum([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text'
])

export const imageTypesEnum = z.enum(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])

export const docExtractClientOptionsSchema = z.object({
  allowedImages: z.array(imageTypesEnum).optional(),
  allowedDocuments: z.array(documentTypesEnum).optional()
})

export const documentSchema = z.object({
  filename: z.string().optional(),
  type: z.string().optional(), // Accept any string for type, validation will be done separately
  url: z
    .string()
    .refine(val => !val || isValidUrl(val), { message: 'Invalid URL format' })
    .optional(),
  contents: z.instanceof(Buffer).optional()
})

// Generate types from schemas
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
