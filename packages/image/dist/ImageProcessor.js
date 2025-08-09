// Import sharp for image processing
import sharp from 'sharp';
/**
 * Image processor implementation
 */
export class ImageProcessor {
    /**
     * The MIME type this processor handles
     * Note: This processor handles multiple image types
     */
    supportedMimeType = 'image/jpeg'; // Primary MIME type
    /**
     * All supported MIME types
     */
    supportedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    /**
     * Process an image and extract text using OCR
     * @param document The image to process
     * @returns Extracted text from the image
     */
    async process(doc) {
        if (!doc.contents) {
            throw new Error('Image must have contents');
        }
        try {
            // Use sharp to process the image
            const metadata = await sharp(doc.contents).metadata();
            // This is a placeholder for actual OCR processing
            // In a real implementation, you would use an OCR library or service
            return `[Image processed: ${metadata.width}x${metadata.height}, format: ${metadata.format}]
To implement actual OCR, you would need to:
1. Use an OCR library like Tesseract.js
2. Or integrate with an OCR service like Google Cloud Vision API or AWS Textract`;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to process image: ${errorMessage}`);
        }
    }
}
//# sourceMappingURL=ImageProcessor.js.map