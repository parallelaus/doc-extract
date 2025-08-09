import { DocExtract } from '@parallelsoftware/doc-extract'
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf'

async function extractPDF() {
  const url = 'https://www.princexml.com/samples/icelandic/dictionary.pdf'
  console.log('Extracting PDF from URL: ', url)
  const docExtract = new DocExtract()

  docExtract.registerProcessor(new PdfProcessor())

  const document = {
    type: 'application/pdf',
    url
  }

  const result = await docExtract.extract(document)

  console.log('Extracted Text:\n', result.text)
}

console.log('Extracting PDF...')
extractPDF()
  .then(() => console.log('PDF extracted successfully'))
  .catch(error => console.error('Error extracting PDF:', error))
