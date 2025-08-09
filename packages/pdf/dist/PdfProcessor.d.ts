import type { Document, ExtractedText } from '../../core/src/lib/types.js';
import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js';
/**
 * PDF document processor implementation
 */
export declare class PdfProcessor implements DocumentProcessor {
    /**
     * The MIME type this processor handles
     */
    readonly supportedMimeType = "application/pdf";
    /**
     * Process a PDF document and extract text
     * @param document The PDF document to process
     * @returns Extracted text from the PDF document
     */
    process(document: Document): Promise<ExtractedText>;
}
//# sourceMappingURL=PdfProcessor.d.ts.map