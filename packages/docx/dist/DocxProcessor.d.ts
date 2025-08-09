import type { Document } from '../../core/src/lib/types.js';
import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js';
/**
 * DOCX document processor implementation
 */
export declare class DocxProcessor implements DocumentProcessor {
    /**
     * The MIME type this processor handles
     */
    readonly supportedMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    /**
     * Process a DOCX document and extract text
     * @param document The DOCX document to process
     * @returns Extracted text from the DOCX document
     */
    process(doc: Document): Promise<string>;
}
//# sourceMappingURL=DocxProcessor.d.ts.map