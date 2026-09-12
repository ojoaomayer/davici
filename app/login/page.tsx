'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Terminal, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()

  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleGoogleLogin = async () => {
    setErrorMsg('')
    setIsSubmitting(true)
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (err: any) {
      console.error(err)
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Falha na autenticação Google. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      if (isSignUp) {
        if (password.length < 6) {
          setErrorMsg('A senha deve conter no mínimo 6 caracteres.')
          setIsSubmitting(false)
          return
        }
        await signUpWithEmail(email, password, nome)
      } else {
        await signInWithEmail(email, password)
      }
      router.push('/dashboard')
    } catch (err: any) {
      console.error(err)
      let msg = 'Erro ao processar autenticação.'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Credenciais incorretas.'
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'E-mail já registrado. Tente entrar.'
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Endereço de e-mail inválido.'
      }
      setErrorMsg(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 mx-auto flex items-center justify-center text-zinc-300 mb-3">
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-zinc-100">
            {isSignUp ? 'Criar Conta DeVici' : 'Acesso ao Workspace'}
          </h1>
          <p className="text-xs text-zinc-500">
            {isSignUp ? 'Comece com 1 orçamento gratuito' : 'Entre com suas credenciais corporativas'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-zinc-950 p-1 rounded border border-zinc-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 py-1 rounded transition-colors ${
              !isSignUp ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 py-1 rounded transition-colors ${
              isSignUp ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Registrar
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-2.5 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google SSO */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2.5 py-2 px-3 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-xs font-medium transition-colors disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Continuar com Google</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase">ou e-mail</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400">Nome / Empresa</label>
              <input
                type="text"
                required={isSignUp}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Eng. João Mayer"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-zinc-400">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engenharia@empresa.com"
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-zinc-400">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2 px-3 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs border border-zinc-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Criar Conta' : 'Acessar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-zinc-500 font-mono text-xs">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  )
}
