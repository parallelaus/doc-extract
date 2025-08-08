import { BaseOcrProvider } from '../OcrProvider.js'
import { MistralOcrProviderOptions, mistralOcrProviderOptionsSchema } from './types.js'

export class MistralOcrProvider extends BaseOcrProvider {
  // Private Members
  private apiKey: string

  constructor(options: MistralOcrProviderOptions) {
    super() // Call parent constructor

    // Validate options using the utility function
    const validatedOptions = mistralOcrProviderOptionsSchema.parse(options)
    this.apiKey = validatedOptions.apiKey

    console.log('Mistral OCR provider initialized with API key: ', this.apiKey)
  }
}
