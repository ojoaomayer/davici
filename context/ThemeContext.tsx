'use client'

import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'

export type Theme = 'dark' | 'light'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // `next-themes` previne hydration mismatch injetando um script nativo que roda antes do React.
  // disableTransitionOnChange garante que não haverá animações piscando na troca durante load.
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      enableColorScheme
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'dark'
  const isDark = currentTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    theme: (currentTheme as Theme) || 'dark',
    isDark,
    toggleTheme,
    setTheme: (newTheme: Theme) => setTheme(newTheme),
  }
}
