'use client'

import React from 'react'
import Image from 'next/image'

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

  // Alternância 100% via CSS puro:
  // Renderiza ambas as imagens no JSX estático (SSR e Client idênticos, 0 erro de hidratação).
  // A classe .dark no HTML/Body controla qual delas é exibida instantaneamente.
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Logo Branca (Visível no Dark Mode) */}
      <Image
        src="/logos/logo-branca.png"
        alt="DeVici"
        width={width}
        height={height}
        priority={priority}
        className="object-contain h-full w-auto transition-opacity duration-200 hidden dark:block"
      />

      {/* Logo Preta (Visível no Light Mode) */}
      <Image
        src="/logos/logo-preta.png"
        alt="DeVici"
        width={width}
        height={height}
        priority={priority}
        className="object-contain h-full w-auto transition-opacity duration-200 block dark:hidden"
      />
    </div>
  )
}
