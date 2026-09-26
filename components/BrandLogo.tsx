'use client'

import React from 'react'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'

interface BrandLogoProps {
  className?: string
  width?: number
  height?: number
  priority?: boolean
  variant?: 'auto' | 'white' | 'black'
}

export function BrandLogo({
  className = 'h-8 w-auto',
  width = 160,
  height = 80,
  priority = false,
  variant = 'auto',
}: BrandLogoProps) {
  let isDark = true
  try {
    const themeContext = useTheme()
    isDark = themeContext.isDark
  } catch {
    isDark = true
  }

  if (variant === 'white') {
    return (
      <Image
        src="/logos/logo-branca.png"
        alt="DeVici"
        width={width}
        height={height}
        priority={priority}
        className={`object-contain ${className}`}
      />
    )
  }

  if (variant === 'black') {
    return (
      <Image
        src="/logos/logo-preta.png"
        alt="DeVici"
        width={width}
        height={height}
        priority={priority}
        className={`object-contain ${className}`}
      />
    )
  }

  // Auto mode: seleciona a logo de acordo com o tema atual
  // Logo Branca para fundo escuro, Logo Preta para fundo claro
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <Image
        key={isDark ? 'dark-logo' : 'light-logo'}
        src={isDark ? '/logos/logo-branca.png' : '/logos/logo-preta.png'}
        alt="DeVici"
        width={width}
        height={height}
        priority={priority}
        className="object-contain h-full w-auto transition-all duration-300 hover:opacity-90"
      />
    </div>
  )
}
