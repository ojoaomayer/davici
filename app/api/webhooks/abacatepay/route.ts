import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { PLANS } from '@/lib/abacatepay';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secretFromQuery = searchParams.get('secret') || searchParams.get('webhookSecret');
    const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

    // Se o secret foi configurado no .env, faz a validação de segurança
    if (expectedSecret && secretFromQuery && secretFromQuery !== expectedSecret) {
      console.warn('Webhook AbacatePay: Secret inválido recebido.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Webhook AbacatePay recebido:', JSON.stringify(body, null, 2));

    const event = body?.event;
    const data = body?.data || body;
    const chargeId = body?.chargeId || data?.id || data?.chargeId;

    // Processar apenas eventos de pagamento aprovado
    if (event === 'billing.paid' || event === 'checkout.completed' || data?.status === 'PAID') {
      let userId = data?.metadata?.userId;
      let planId: 'pro' | 'construtora' = data?.metadata?.planId;

      // Caso o webhook contenha apenas o chargeId/id e falte metadata, podemos buscar os detalhes na API do AbacatePay
      if (!userId && chargeId && process.env.ABACATEPAY_API_KEY) {
        try {
          const fetchResp = await fetch(`https://api.abacatepay.com/v1/billing/${chargeId}`, {
            headers: {
              Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
            },
          });
          if (fetchResp.ok) {
            const billingDetails = await fetchResp.json();
            const billingData = billingDetails?.data || billingDetails;
            userId = billingData?.metadata?.userId;
            planId = billingData?.metadata?.planId || 'pro';
          }
        } catch (fetchErr) {
          console.error('Erro ao buscar detalhes da cobrança no AbacatePay:', fetchErr);
        }
      }

      // Se ainda não achou userId pelo metadata, tenta localizar pelo e-mail do cliente
      if (!userId && (data?.customer?.email || data?.client?.email)) {
        const customerEmail = data?.customer?.email || data?.client?.email;
        const usersRef = db.collection('users');
        const userQuery = await usersRef.where('email', '==', customerEmail).limit(1).get();
        if (!userQuery.empty) {
          userId = userQuery.docs[0].id;
        }
      }

      if (!userId) {
        console.error('Webhook AbacatePay: Não foi possível identificar o usuário para a cobrança:', chargeId);
        return NextResponse.json(
          { message: 'Evento recebido, mas usuário não identificado.', chargeId },
          { status: 200 }
        );
      }

      // Definir limites e detalhes do plano
      const selectedPlan = planId === 'construtora' ? 'construtora' : 'pro';
      const planConfig = PLANS[selectedPlan];

      const userDocRef = db.collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        await userDocRef.update({
          plano: selectedPlan,
          planilhas_limite: planConfig.limit,
          status_assinatura: 'active',
          ultimo_pagamento_em: new Date().toISOString(),
          charge_id: chargeId || null,
        });
      } else {
        await userDocRef.set(
          {
            uid: userId,
            email: data?.customer?.email || '',
            plano: selectedPlan,
            planilhas_limite: planConfig.limit,
            planilhas_usadas: 0,
            status_assinatura: 'active',
            ultimo_pagamento_em: new Date().toISOString(),
            charge_id: chargeId || null,
          },
          { merge: true }
        );
      }

      // Registrar histórico de pagamento no Firestore
      await db.collection('pagamentos').add({
        userId,
        chargeId: chargeId || null,
        plano: selectedPlan,
        valor: data?.amount || planConfig.priceCents,
        metodo: data?.method || 'PIX',
        status: 'PAID',
        criado_em: new Date().toISOString(),
        rawEvent: body,
      });

      console.log(`✅ Usuário ${userId} promovido com sucesso para o plano ${selectedPlan}!`);
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error: any) {
    console.error('Erro processando webhook AbacatePay:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no webhook' },
      { status: 500 }
    );
  }
}
