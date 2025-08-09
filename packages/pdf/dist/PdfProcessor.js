// Import pdf-parse with proper default import
import pdfParse from 'pdf-parse';
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
            throw new Error('PDF document must have contents');
        }
        try {
            // Use pdf-parse to extract text from the PDF
            const pdfData = await pdfParse(document.contents);
            return pdfData.text;
        }
        catch (error) {
            // Handle error properly with type checking
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
        }
    }
}
//# sourceMappingURL=PdfProcessor.js.map