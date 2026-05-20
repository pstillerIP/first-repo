import { supabase } from '@/lib/supabase'
import { ProductionOrder } from '@/types'
import SummaryBar from './components/summary-bar'
import FilterableOrders from './components/filterable-orders'

async function getOrders(): Promise<ProductionOrder[]> {
  const { data, error } = await supabase
    .from('production_orders')
    .select('*')
    .order('due_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data as ProductionOrder[]
}

export default async function DashboardPage() {
  const orders = await getOrders()

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#1A4D2E' }}>
          Production Dashboard
        </h1>
        <SummaryBar orders={orders} />
      </div>
      <FilterableOrders orders={orders} />
    </div>
  )
}
