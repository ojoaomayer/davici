import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF
    const data = await pdfParse(buffer);
    
    // Split text by newlines
    const rawLines = data.text.split(/\r?\n/);
    
    // Try to construct a grid (array of arrays)
    const grid: string[][] = [];

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Split by 2 or more spaces, or tabs, to simulate columns in a table.
      // PDFs usually don't have tab characters, but multiple spaces visually separate columns.
      const columns = trimmed.split(/\s{2,}|\t/);
      
      // If splitting by multiple spaces didn't yield columns, fallback to single space
      // but only if it looks like a row that should have columns (e.g. starts with a number/code)
      if (columns.length === 1) {
        // Simple fallback: just put the whole line in one column. 
        // The user will map this to description, but might miss quantities.
        grid.push([trimmed]);
      } else {
        grid.push(columns.map(c => c.trim()));
      }
    }

    return NextResponse.json({
      success: true,
      grid,
      textLength: data.text.length,
      pages: data.numpages
    });

  } catch (error: any) {
    console.error('Erro ao processar PDF:', error);
    return NextResponse.json(
      { error: 'Falha ao ler o arquivo PDF. O arquivo pode estar corrompido ou protegido.' },
      { status: 500 }
    );
  }
}
