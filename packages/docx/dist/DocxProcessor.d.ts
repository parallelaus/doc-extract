interface Document {
    type: string;
    url?: string;
    contents?: Buffer;
}
interface DocumentProcessor {
    readonly supportedMimeType: string;
    process(doc: Document): Promise<string>;
}
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
export {};
//# sourceMappingURL=DocxProcessor.d.ts.map