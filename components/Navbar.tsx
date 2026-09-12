'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileSpreadsheet, Calculator, LayoutDashboard, LogIn, LogOut, Terminal, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { user, userData, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition-colors">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-zinc-100">
                DeVici
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="SINAPI 08/2026 Online" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 border-l border-zinc-800 pl-6">
            <Link
              href="/orcamento"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                isActive('/orcamento')
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-400" />
              Orçamentador
            </Link>
            <Link
              href="/ferramentas/calculadora-bdi"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                isActive('/ferramentas/calculadora-bdi')
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              BDI TCU
            </Link>
            <Link
              href="/consultas"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                isActive('/consultas')
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              Consultar SINAPI
            </Link>
            <Link
              href="/#precos"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all duration-200 active:scale-[0.98]"
            >
              Planos
            </Link>
          </nav>
        </div>

        {/* Right CTA / Auth Status */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 active:scale-[0.98] ${
                  isActive('/dashboard')
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Painel</span>
                {userData?.plano && (
                  <span className="px-1 py-0.2 rounded text-[10px] uppercase font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {userData.plano}
                  </span>
                )}
              </Link>
              <button
                onClick={() => logout()}
                title="Encerrar sessão"
                className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-200 active:scale-[0.95]"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-all duration-200 active:scale-[0.98]"
              >
                Entrar
              </Link>
              <Link
                href="/login?mode=signup"
                className="px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white rounded-md border border-zinc-200 transition-all duration-200 hover-lift active:scale-[0.98] shadow-sm"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
