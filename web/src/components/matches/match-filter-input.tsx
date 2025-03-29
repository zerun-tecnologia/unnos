import { Button, Input, Select, SelectItem } from '@heroui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

export function FilterInput() {
  const params = useSearchParams()
  const status = params.get('status')
  const [debouncedSearch, setSearch] = useDebounceValue('', 1000)
  const [statusFilter, setStatusFilter] = useState(status || 'all')

  const router = useRouter()

  function handleSearch(debouncedSearch: string, statusFilter: string) {
    const url = new URL(window.location.href)

    debouncedSearch ? url.searchParams.set('search', debouncedSearch) : url.searchParams.delete('search')
    statusFilter && url.searchParams.set('status', statusFilter)

    router.push(url.toString())
  }

  useEffect(() => {
    handleSearch(debouncedSearch, statusFilter)
  }, [debouncedSearch, statusFilter])

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 mb-8 flex flex-col md:flex-row gap-4"
    >
      <Input
        label="Buscar partidas..."
        size="sm"
        onChange={(e) => { setSearch(e.target.value) }}
      />
      <Select
        size="sm"
        className="w-1/3"
        label="Filtrar por status"
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        defaultSelectedKeys={[statusFilter]}
      >
        <SelectItem key="all">All Statuses</SelectItem>
        <SelectItem key="open">Open</SelectItem>
        <SelectItem key="in progress">In Progress</SelectItem>
        <SelectItem key="completed">Completed</SelectItem>
      </Select>

    </motion.div>
  )
}
