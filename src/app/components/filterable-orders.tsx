'use client'

import { useState } from 'react'
import { ProductionOrder, OrderStatus } from '@/types'
import OrderCard from './order-card'

const STATUSES: OrderStatus[] = ['Running', 'Pending', 'Down', 'Complete']
const LINES = ['Line 1', 'Line 2', 'Line 3']

interface Props {
  orders: ProductionOrder[]
}

export default function FilterableOrders({ orders }: Props) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All')
  const [lineFilter, setLineFilter] = useState<string>('All')

  const filtered = orders.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false
    if (lineFilter !== 'All' && o.production_line !== lineFilter) return false
    return true
  })

  const btnBase = 'px-3 py-1 rounded-full text-sm font-semibold border transition-colors cursor-pointer'

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('All')}
          className={btnBase}
          style={statusFilter === 'All'
            ? { backgroundColor: '#1A4D2E', color: '#fff', borderColor: '#1A4D2E' }
            : { backgroundColor: '#fff', color: '#1F2937', borderColor: '#D1D5DB' }}
        >
          All Statuses
        </button>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={btnBase}
            style={statusFilter === s
              ? { backgroundColor: '#1A4D2E', color: '#fff', borderColor: '#1A4D2E' }
              : { backgroundColor: '#fff', color: '#1F2937', borderColor: '#D1D5DB' }}
          >
            {s}
          </button>
        ))}
        <span className="self-center text-sm" style={{ color: '#D1D5DB' }}>|</span>
        <button
          onClick={() => setLineFilter('All')}
          className={btnBase}
          style={lineFilter === 'All'
            ? { backgroundColor: '#1A4D2E', color: '#fff', borderColor: '#1A4D2E' }
            : { backgroundColor: '#fff', color: '#1F2937', borderColor: '#D1D5DB' }}
        >
          All Lines
        </button>
        {LINES.map(l => (
          <button
            key={l}
            onClick={() => setLineFilter(l)}
            className={btnBase}
            style={lineFilter === l
              ? { backgroundColor: '#1A4D2E', color: '#fff', borderColor: '#1A4D2E' }
              : { backgroundColor: '#fff', color: '#1F2937', borderColor: '#D1D5DB' }}
          >
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm" style={{ color: '#6B7280' }}>No orders match the selected filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
