interface Document {
    type: string;
    url?: string;
    contents?: Buffer;
}
interface DocumentProcessor {
    readonly supportedMimeType: string;
    process(document: Document): Promise<string>;
}
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
    process(document: Document): Promise<string>;
}
export {};
//# sourceMappingURL=PdfProcessor.d.ts.map