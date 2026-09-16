'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileSpreadsheet,
  Calculator,
  LayoutDashboard,
  LogOut,
  Search,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { user, userData, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#020617]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center group">
            <span className="text-lg font-medium tracking-tight text-white group-hover:text-slate-200 transition-colors">
              DeVici
            </span>
          </Link>

          {/* Desktop Nav with modern underline indicators */}
          <nav className="hidden md:flex items-center gap-6 h-16">
            <Link
              href="/#como-funciona"
              className="relative h-16 flex items-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Como funciona
            </Link>

            <Link
              href="/ferramentas/calculadora-bdi"
              className={`relative h-16 flex items-center gap-2 text-xs font-medium transition-colors ${
                isActive('/ferramentas/calculadora-bdi')
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-400 after:shadow-[0_0_8px_rgba(96,165,250,0.8)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 opacity-80" />
              <span>Calculadora BDI</span>
            </Link>

            <Link
              href="/consultas"
              className={`relative h-16 flex items-center gap-2 text-xs font-medium transition-colors ${
                isActive('/consultas')
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-400 after:shadow-[0_0_8px_rgba(96,165,250,0.8)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5 opacity-80" />
              <span>Buscador SINAPI</span>
            </Link>

            <Link
              href="/#precos"
              className="relative h-16 flex items-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Planos
            </Link>
          </nav>
        </div>

        {/* Right CTA / Auth Status & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Auth (Hidden on small screens where drawer is used) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className={`relative h-16 flex items-center gap-2 text-xs font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-400 after:shadow-[0_0_8px_rgba(96,165,250,0.8)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 opacity-80" />
                  <span>Workspace</span>
                  {userData?.plano && (
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      ({userData.plano})
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => logout()}
                  title="Encerrar sessão"
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="btn-primary px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 group"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="w-3 h-3 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick mobile action & hamburger */}
          {!user && (
            <Link
              href="/login?mode=signup"
              className="md:hidden btn-primary px-3 py-1 text-[11px] font-semibold"
            >
              Começar
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#020617]/95 backdrop-blur-2xl px-4 py-5 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-2 font-mono text-xs">
            <Link
              href="/#como-funciona"
              onClick={closeMobileMenu}
              className="px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Como funciona
            </Link>

            <Link
              href="/ferramentas/calculadora-bdi"
              onClick={closeMobileMenu}
              className={`px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-colors ${
                isActive('/ferramentas/calculadora-bdi')
                  ? 'bg-blue-500/10 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Calculadora BDI</span>
            </Link>

            <Link
              href="/consultas"
              onClick={closeMobileMenu}
              className={`px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-colors ${
                isActive('/consultas')
                  ? 'bg-blue-500/10 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Buscador SINAPI</span>
            </Link>

            <Link
              href="/#precos"
              onClick={closeMobileMenu}
              className="px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Planos
            </Link>
          </nav>

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full btn-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Acessar Workspace</span>
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu()
                    logout()
                  }}
                  className="w-full py-2 text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Encerrar sessão
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full btn-secondary py-2.5 text-xs font-semibold text-center"
                >
                  Entrar
                </Link>
                <Link
                  href="/login?mode=signup"
                  onClick={closeMobileMenu}
                  className="w-full btn-primary py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-900" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
