export interface PlanConfig {
  id: 'pro' | 'construtora';
  name: string;
  priceCents: number; // Centavos: 9700 = R$ 97,00
  limit: number;
  description: string;
}

export const PLANS: Record<'pro' | 'construtora', PlanConfig> = {
  pro: {
    id: 'pro',
    name: 'Plano Profissional - DeVici',
    priceCents: 9700,
    limit: 10,
    description: 'Até 10 planilhas completas por mês, BDI TCU e Suporte WhatsApp',
  },
  construtora: {
    id: 'construtora',
    name: 'Plano Construtora - DeVici',
    priceCents: 24700,
    limit: 999,
    description: 'Planilhas ilimitadas, múltiplos usuários e suporte SINAPI/SICRO',
  },
};

interface CreateBillingParams {
  planId: 'pro' | 'construtora';
  userId: string;
  userEmail: string;
  userName?: string;
  userCpfCnpj?: string;
  userPhone?: string;
  baseUrl?: string;
}

export async function createAbacateBilling({
  planId,
  userId,
  userEmail,
  userName,
  userCpfCnpj,
  userPhone,
  baseUrl,
}: CreateBillingParams) {
  const apiKey = process.env.ABACATEPAY_API_KEY;

  if (!apiKey) {
    throw new Error('Chave de API do AbacatePay (ABACATEPAY_API_KEY) não configurada no .env');
  }

  const plan = PLANS[planId];
  if (!plan) {
    throw new Error(`Plano inválido: ${planId}`);
  }

  const host = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const returnUrl = `${host}/dashboard?payment=cancelled`;
  const completionUrl = `${host}/dashboard?payment=success&plan=${planId}`;

  // AbacatePay billing payload
  const payload = {
    frequency: 'ONE_TIME', // ou SUBSCRIPTION conforme suporte na sua conta
    methods: ['PIX', 'CARD'],
    products: [
      {
        externalId: `devici_${plan.id}`,
        name: plan.name,
        description: plan.description,
        quantity: 1,
        price: plan.priceCents,
      },
    ],
    returnUrl,
    completionUrl,
    customer: {
      name: userName || userEmail.split('@')[0] || 'Cliente DeVici',
      email: userEmail,
      cellphone: userPhone || '11999999999',
      taxId: userCpfCnpj || '00000000000',
    },
    metadata: {
      userId,
      planId,
      planName: plan.name,
    },
  };

  const response = await fetch('https://api.abacatepay.com/v1/billing/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Erro na API AbacatePay:', errorBody);
    throw new Error(`Erro AbacatePay (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  // A resposta do AbacatePay retorna a URL do checkout em data.data.url ou data.url
  const checkoutUrl = data?.data?.url || data?.url;

  if (!checkoutUrl) {
    console.error('Resposta inesperada da API AbacatePay:', data);
    throw new Error('URL de pagamento não foi retornada pelo AbacatePay.');
  }

  return {
    url: checkoutUrl,
    billingId: data?.data?.id || data?.id,
  };
}
