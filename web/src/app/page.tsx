import { Chart } from '@/components/chart'
import { Button } from '@heroui/react'
import { EChartsOption } from 'echarts/types/dist/echarts'
import Image from 'next/image'
import { Suspense } from 'react'
import { ListUsers } from './list-users'
import { ListMatches } from './list-matches'

export default function Home() {
  const chartOptions: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <Chart
          options={chartOptions}
          className="w-[400px] h-96"
        /> */}
        <Suspense fallback="Loading...">
          <ListUsers />
        </Suspense>

        <Suspense fallback="Loading...">
          <ListMatches />
        </Suspense>
      </main>
    </div>
  )
}
