/**
 * Type declarations for pdf-parse-debugging-disabled
 */

declare module 'pdf-parse-debugging-disabled' {
  interface PdfData {
    /** The extracted text content */
    text: string;
    /** Number of pages in the PDF */
    numpages: number;
    /** Number of rendered pages */
    numrender: number;
    /** PDF info dictionary */
    info: Record<string, any>;
    /** PDF metadata */
    metadata: Record<string, any>;
    /** PDF.js version */
    version: string;
  }

  /**
   * Parse PDF content
   * @param dataBuffer - PDF file buffer
   * @param options - Optional configuration options
   * @returns Promise resolving to the parsed PDF data
   */
  function pdfParse(
    dataBuffer: Buffer | Uint8Array,
    options?: {
      pagerender?: (pageData: any) => string;
      max?: number;
      version?: string;
    }
  ): Promise<PdfData>;

  export default pdfParse;
}
