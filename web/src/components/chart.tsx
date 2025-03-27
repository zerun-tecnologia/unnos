'use client'

import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

export type FormatterCallbackParams =
  echarts.TooltipComponentFormatterCallbackParams

type Props = {
  options: echarts.EChartsOption
  className?: string
}

export function Chart({ options, className }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<echarts.ECharts>(undefined)

  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current!)

    // Handle resizing
    const handleResize = () => chartInstance.current?.resize()

    window.addEventListener('resize', handleResize)

    // Cleanup on unmount
    return () => {
      chartInstance.current?.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!chartInstance.current)
      return

    chartInstance.current.setOption(options)
  }, [options])

  return (
    <div
      ref={chartRef}
      className={className}
    />
  )
}
