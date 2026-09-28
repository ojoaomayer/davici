import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Instanciar o cliente Gemini (garanta que a chave esteja no .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Chave de API do Gemini não configurada (GEMINI_API_KEY).');
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Usar o modelo Flash mais recente disponível, que suporta PDFs/Imagens nativamente
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
    Você é um extrator de dados de orçamentos e planilhas de engenharia.
    Eu estou enviando um arquivo PDF (que pode ser escaneado ou digital) contendo uma tabela de orçamento.
    
    SUA TAREFA:
    Extraia a tabela completa e retorne **EXATAMENTE e APENAS** um JSON válido contendo um array bidimensional (array de arrays).
    - O primeiro array interno deve conter os cabeçalhos das colunas (ex: ["Item", "Código", "Descrição", "Und", "Qtd"]).
    - Os arrays subsequentes devem conter os valores das linhas correspondentes.
    - Se a tabela estiver dividida em várias páginas, unifique tudo em um único array bidimensional contínuo.
    - Não inclua NENHUM texto antes ou depois do JSON. Não use blocos de código markdown (como \`\`\`json). Retorne apenas o JSON bruto que pode ser parseado com JSON.parse().
    - Trate arquivos escaneados fazendo OCR preciso de todas as colunas visíveis.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf',
        },
      },
      prompt,
    ]);

    const responseText = result.response.text().trim();
    
    // Limpar possíveis resquícios de markdown caso a IA coloque
    let cleanJsonStr = responseText;
    if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    }

    const grid = JSON.parse(cleanJsonStr);

    if (!Array.isArray(grid)) {
      throw new Error('A IA não retornou um array válido.');
    }

    return NextResponse.json({
      success: true,
      grid,
    });

  } catch (error: any) {
    console.error('Erro ao processar PDF via Gemini:', error);
    return NextResponse.json(
      { error: 'Falha ao ler o arquivo PDF. Tente enviar uma imagem mais nítida ou um formato suportado.' },
      { status: 500 }
    );
  }
}
