"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IndicatorTabsProps {
  activeIndicators: string[]
  toggleIndicator: (indicator: string) => void
}

export default function IndicatorTabs({ activeIndicators, toggleIndicator }: IndicatorTabsProps) {
  const indicators = [
    { id: "candlestick", label: "Candlestick" },
    { id: "rsi", label: "RSI" },
    { id: "macd", label: "MACD" },
  ]

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Technical Indicators</h2>
      <Tabs defaultValue="candlestick" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          {indicators.map((indicator) => (
            <TabsTrigger
              key={indicator.id}
              value={indicator.id}
              onClick={() => toggleIndicator(indicator.id)}
              data-state={activeIndicators.includes(indicator.id) ? "active" : "inactive"}
              className={activeIndicators.includes(indicator.id) ? "bg-primary text-primary-foreground" : ""}
            >
              {indicator.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
