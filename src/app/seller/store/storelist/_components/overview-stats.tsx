import { Store, Package, DollarSign, BarChart } from 'lucide-react'

const stats = [
  {
    label: 'Cửa hàng',
    value: 4,
    icon: <Store className="w-5 h-5 text-primary" />,
    bg: 'bg-blue-50'
  },
  {
    label: 'Sản phẩm',
    value: 134,
    icon: <Package className="w-5 h-5 text-primary" />,
    bg: 'bg-green-50'
  },
  {
    label: 'Doanh thu tháng',
    value: '32.500.000đ',
    icon: <DollarSign className="w-5 h-5 text-primary" />,
    bg: 'bg-yellow-50'
  },
  {
    label: 'Đơn hàng tháng',
    value: 215,
    icon: <BarChart className="w-5 h-5 text-primary" />,
    bg: 'bg-purple-50'
  }
]

export default function OverviewStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 p-4 rounded-xl shadow-sm ${stat.bg}`}
        >
          <div className="p-2 bg-white rounded-md shadow">
            {stat.icon}
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-lg font-semibold">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
