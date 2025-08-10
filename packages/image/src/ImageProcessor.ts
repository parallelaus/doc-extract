// Import types directly from the core package using relative paths
import type { Document } from '../../core/src/lib/types.js'
import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js'

// Import sharp for image processing
import sharp from 'sharp'

/**
 * Image processor implementation
 */
export class ImageProcessor implements DocumentProcessor {
  /**
   * The MIME type this processor handles
   * Note: This processor handles multiple image types
   */
  public readonly supportedMimeType = 'image/jpeg' // Primary MIME type

  /**
   * All supported MIME types
   */
  public readonly supportedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

  /**
   * Process an image and extract text using OCR
   * @param document The image to process
   * @returns Extracted text from the image
   */
  public async process(doc: Document): Promise<{ text: string }> {
    if (!doc.contents) {
      throw new Error('Image must have contents')
    }
    try {
      // Use sharp to process the image
      const metadata = await sharp(doc.contents).metadata()
      // This is a placeholder for actual OCR processing
      // In a real implementation, you would use an OCR library or service
      return {
        text: `[Image processed: ${metadata.width}x${metadata.height}, format: ${metadata.format}]
To implement actual OCR, you would need to:
1. Use an OCR library like Tesseract.js
2. Or integrate with an OCR service like Google Cloud Vision API or AWS Textract`
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to process image: ${errorMessage}`)
    }
  }
}
