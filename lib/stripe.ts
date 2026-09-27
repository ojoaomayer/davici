import Stripe from 'stripe';

export interface PlanConfig {
  id: 'pro' | 'construtora';
  name: string;
  priceCents: number; // Centavos: 9700 = R$ 97,00
  limit: number;
  description: string;
  priceId?: string;
}

export const PLANS: Record<'pro' | 'construtora', PlanConfig> = {
  pro: {
    id: 'pro',
    name: 'Plano Profissional - DeVici',
    priceCents: 4700, // R$ 47,00
    limit: 10,
    description: 'Até 10 planilhas completas por mês, BDI TCU Oficial e Suporte Especializado',
  },
  construtora: {
    id: 'construtora',
    name: 'Plano Construtora - DeVici',
    priceCents: 9700, // R$ 97,00
    limit: 999,
    description: 'Planilhas ilimitadas, múltiplos acessos e suporte avançado SINAPI/SICRO/SECID',
  },
};

// Instância singleton do Stripe
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Chave secreta do Stripe (STRIPE_SECRET_KEY) não configurada no .env');
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      typescript: true,
    });
  }

  return stripeInstance;
}

interface CreateCheckoutParams {
  planId: 'pro' | 'construtora';
  userId: string;
  userEmail: string;
  userName?: string;
  baseUrl?: string;
}

export async function createStripeCheckoutSession({
  planId,
  userId,
  userEmail,
  userName,
  baseUrl,
}: CreateCheckoutParams) {
  const stripe = getStripe();
  const plan = PLANS[planId];

  if (!plan) {
    throw new Error(`Plano inválido selecionado: ${planId}`);
  }

  const host = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const successUrl = `${host}/dashboard?payment=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${host}/dashboard?payment=cancelled`;

  // Preço dinâmico ou Price ID cadastrado no Stripe Dashboard
  const envPriceId =
    planId === 'pro'
      ? process.env.STRIPE_PRICE_PRO
      : process.env.STRIPE_PRICE_CONSTRUTORA;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = envPriceId
    ? [
        {
          price: envPriceId,
          quantity: 1,
        },
      ]
    : [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.priceCents,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: lineItems,
    customer_email: userEmail,
    client_reference_id: userId,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    metadata: {
      userId,
      planId,
      planName: plan.name,
      userName: userName || '',
    },
    subscription_data: {
      metadata: {
        userId,
        planId,
        planName: plan.name,
      },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (!session.url) {
    throw new Error('Falha ao obter URL de checkout do Stripe.');
  }

  return {
    url: session.url,
    sessionId: session.id,
  };
}
