import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, BarChart3Icon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import type { StockData } from "./dashboard"

interface MetricsCardsProps {
  data: StockData
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(num)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`
    }
    return volume.toString()
  }

  const isBullish = data.trend.toLowerCase() === "bullish"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open</CardTitle>
          <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(data.open)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(data.high)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(data.low)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Close</CardTitle>
          <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(data.close)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume</CardTitle>
          <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatVolume(data.volume)}</div>
        </CardContent>
      </Card>

      <Card className={isBullish ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trend</CardTitle>
          {isBullish ? (
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDownIcon className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${isBullish ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {data.trend}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
