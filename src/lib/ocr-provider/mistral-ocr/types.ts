import { z } from 'zod'

export const mistralOcrProviderOptionsSchema = z.object({
  apiKey: z.string()
})

export type MistralOcrProviderOptions = z.infer<typeof mistralOcrProviderOptionsSchema>
