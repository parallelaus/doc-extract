import { z } from 'zod'
import { isValidUrl } from './validate.js'
// Schema definitions
export const documentSchema = z.object({
  filename: z.string().optional(),
  type: z.string(), // Accept any string for type, validation will be done against registered processors
  url: z
    .string()
    .refine(val => !val || isValidUrl(val), { message: 'Invalid URL format' })
    .optional(),
  contents: z.instanceof(Buffer).optional()
})
export const docExtractClientOptionsSchema = z.object({
  // No longer need to specify allowed types here as they're determined by registered processors
  // Can add other global options here as needed
})
//# sourceMappingURL=types.js.map
