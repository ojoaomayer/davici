'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Antes de montar no cliente, renderiza um botão estático neutro idêntico ao SSR
  // para evitar qualquer incompatibilidade de hidratação (hydration mismatch)
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Alternar tema"
        className={`relative inline-flex items-center justify-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white/[0.05] text-slate-400 ${className}`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Sun className="w-4 h-4 hidden dark:block text-amber-300" />
          <Moon className="w-4 h-4 block dark:hidden text-slate-700" />
        </div>
        {showLabel && (
          <span className="text-xs font-mono font-medium opacity-0">Tema</span>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className={`relative inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-200 border cursor-pointer ${
        isDark
          ? 'bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 border-white/[0.1] hover:border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.1)]'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 hover:border-slate-400 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-mono font-medium">
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </span>
      )}
    </button>
  )
}
