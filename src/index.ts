import { DocumentTypes, ImageTypes, DocExtractClientOptions, Document } from './lib/types.js'
import { DocExtract } from './lib/DocExtract.js'

// Re-export public types
export type { DocumentTypes, ImageTypes, DocExtractClientOptions, Document }

// Re-export public DocExtract class
export { DocExtract }

export { MistralOcrProvider } from './lib/ocr-provider/mistral-ocr/MistralOcrProvider.js'
export type { MistralOcrProviderOptions } from './lib/ocr-provider/mistral-ocr/types.js'
