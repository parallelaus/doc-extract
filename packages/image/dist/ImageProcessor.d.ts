import type { Document } from '../../core/src/lib/types.js';
import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js';
/**
 * Image processor implementation
 */
export declare class ImageProcessor implements DocumentProcessor {
    /**
     * The MIME type this processor handles
     * Note: This processor handles multiple image types
     */
    readonly supportedMimeType = "image/jpeg";
    /**
     * All supported MIME types
     */
    readonly supportedMimeTypes: string[];
    /**
     * Process an image and extract text using OCR
     * @param document The image to process
     * @returns Extracted text from the image
     */
    process(doc: Document): Promise<string>;
}
//# sourceMappingURL=ImageProcessor.d.ts.map