// Import pdf-parse with proper default import
import pdfParse from 'pdf-parse-debugging-disabled';
/**
 * PDF document processor implementation
 */
export class PdfProcessor {
    /**
     * The MIME type this processor handles
     */
    supportedMimeType = 'application/pdf';
    /**
     * Process a PDF document and extract text
     * @param document The PDF document to process
     * @returns Extracted text from the PDF document
     */
    async process(document) {
        if (!document.contents) {
            // Get the file from the url
            // eslint-disable-next-line no-undef
            const response = await fetch(document.url);
            if (!response.ok) {
                throw new Error(`Error retrieveing PDF from URL: ${document.url}`);
            }
            if (!response.headers.get('content-type')?.startsWith('application/pdf')) {
                throw new Error(`URL ${document.url} does not point to a PDF file`);
            }
            document.contents = Buffer.from(await response.arrayBuffer());
        }
        try {
            // Use pdf-parse to extract text from the PDF
            const pdfData = await pdfParse(document.contents);
            console.log(Object.keys(pdfData));
            console.log(pdfData.info);
            console.log(pdfData.metadata);
            return { text: pdfData.text };
        }
        catch (error) {
            // Handle error properly with type checking
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
        }
    }
}
//# sourceMappingURL=PdfProcessor.js.map