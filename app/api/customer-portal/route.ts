import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'UserId obrigatório' }, { status: 400 });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const userData = userDoc.data();
    const customerId = userData?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura Stripe associada a este usuário.' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || req.headers.get('host') || 'http://localhost:3000';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Erro ao abrir portal do cliente Stripe:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar sessão do portal.' },
      { status: 500 }
    );
  }
}
