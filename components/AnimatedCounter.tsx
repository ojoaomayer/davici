'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  enableLiveIncrement?: boolean
  incrementIntervalMin?: number
  incrementIntervalMax?: number
  className?: string
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 1500,
  prefix = '',
  suffix = '',
  decimals = 0,
  enableLiveIncrement = false,
  incrementIntervalMin = 3000,
  incrementIntervalMax = 7000,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(from)
  const [isFlashing, setIsFlashing] = useState(false)
  const currentValRef = useRef(from)

  // 1. Initial smooth ease-out count up
  useEffect(() => {
    let startTimestamp: number | null = null
    const startValue = from
    const endValue = to

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Ease out cubic: 1 - Math.pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * easeOut

      currentValRef.current = current
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        currentValRef.current = endValue
        setDisplayValue(endValue)
      }
    }

    const animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [from, to, duration])

  // 2. Live periodic increment (telemetry simulation)
  useEffect(() => {
    if (!enableLiveIncrement) return

    let timeoutId: NodeJS.Timeout

    const scheduleNextTick = () => {
      const delay = Math.floor(
        Math.random() * (incrementIntervalMax - incrementIntervalMin) + incrementIntervalMin
      )

      timeoutId = setTimeout(() => {
        const increment = Math.random() > 0.4 ? 1 : 2
        const nextVal = currentValRef.current + increment
        currentValRef.current = nextVal
        setDisplayValue(nextVal)
        
        setIsFlashing(true)
        setTimeout(() => setIsFlashing(false), 800)

        scheduleNextTick()
      }, delay)
    }

    // Start after initial animation finishes
    const initialDelay = setTimeout(() => {
      scheduleNextTick()
    }, duration + 500)

    return () => {
      clearTimeout(initialDelay)
      clearTimeout(timeoutId)
    }
  }, [enableLiveIncrement, duration, incrementIntervalMin, incrementIntervalMax])

  const formattedNumber = decimals > 0
    ? displayValue.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.floor(displayValue).toLocaleString('pt-BR')

  return (
    <span className={`inline-flex items-center transition-colors duration-500 ${isFlashing ? 'text-emerald-300' : ''} ${className}`}>
      {prefix}{formattedNumber}{suffix}
    </span>
  )
}
