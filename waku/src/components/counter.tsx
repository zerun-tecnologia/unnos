'use client'

import { Button } from '@heroui/react'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => setCount(c => c + 1)

  return (
    <section className="border-blue-400 -mx-4 mt-4 rounded-sm border border-dashed p-4">
      <div>
        Count:
        {count}
      </div>
      <Button
        onPress={handleIncrement}
      >
        Increment
      </Button>
    </section>
  )
}
