import { NextRequest, NextResponse } from 'next/server';
import { createAbacateBilling, PLANS } from '@/lib/abacatepay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, userId, userEmail, userName, userCpfCnpj, userPhone } = body;

    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios ausentes (planId, userId, userEmail).' },
        { status: 400 }
      );
    }

    if (planId !== 'pro' && planId !== 'construtora') {
      return NextResponse.json(
        { error: `Plano inválido: ${planId}. Opções válidas: 'pro' ou 'construtora'.` },
        { status: 400 }
      );
    }

    // Obter URL base da aplicação
    const origin = req.headers.get('origin') || req.headers.get('host') || 'http://localhost:3000';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    const { url, billingId } = await createAbacateBilling({
      planId,
      userId,
      userEmail,
      userName,
      userCpfCnpj,
      userPhone,
      baseUrl,
    });

    return NextResponse.json({
      success: true,
      url,
      billingId,
      plan: PLANS[planId as 'pro' | 'construtora'],
    });
  } catch (error: any) {
    console.error('Erro ao gerar checkout AbacatePay:', error);
    return NextResponse.json(
      {
        error: error.message || 'Erro ao comunicar com o gateway AbacatePay.',
      },
      { status: 500 }
    );
  }
}
