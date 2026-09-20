'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2, Zap } from 'lucide-react'

interface CheckoutButtonProps {
  planId: 'pro' | 'construtora'
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export function CheckoutButton({
  planId,
  children,
  className = '',
  variant = 'primary',
}: CheckoutButtonProps) {
  const { user, userData } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleCheckout = async () => {
    setErrorMessage(null)

    // Se o usuário não estiver logado, direciona para login/cadastro salvando o plano
    if (!user) {
      router.push(`/login?mode=signup&plan=${planId}`)
      return
    }

    // Se o usuário já tiver esse plano ativo
    if (userData?.plano === planId) {
      router.push('/dashboard')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/checkout/abacatepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || userData?.nome || '',
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Não foi possível gerar a cobrança no momento.')
      }

      // Redireciona para o checkout do AbacatePay
      window.location.href = data.url
    } catch (err: any) {
      console.error('Erro ao iniciar checkout:', err)
      setErrorMessage(err.message || 'Erro ao conectar ao checkout.')
      setLoading(false)
    }
  }

  const baseStyle =
    variant === 'primary'
      ? 'btn-primary w-full py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 cursor-pointer transition-all'
      : 'btn-secondary w-full py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 cursor-pointer transition-all'

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${baseStyle} ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Gerando Pix Seguro...</span>
          </>
        ) : (
          <>
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {children}
          </>
        )}
      </button>
      {errorMessage && (
        <p className="text-[11px] text-rose-400 text-center font-mono">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
