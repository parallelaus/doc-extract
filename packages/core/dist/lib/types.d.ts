import { z } from 'zod';
export declare const documentSchema: z.ZodObject<{
    filename: z.ZodOptional<z.ZodString>;
    type: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    contents: z.ZodOptional<z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>>;
}, z.core.$strip>;
export declare const docExtractClientOptionsSchema: z.ZodObject<{}, z.core.$strip>;
/**
 * Client options for DocExtract constructor
 */
export type DocExtractClientOptions = z.infer<typeof docExtractClientOptionsSchema>;
/**
 * Document object for text extraction
 */
export type Document = z.infer<typeof documentSchema>;
//# sourceMappingURL=types.d.ts.map