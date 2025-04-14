"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const timeframes = [
  { value: "1mo", label: "1 Month" },
  { value: "3mo", label: "3 Months" },
  { value: "6mo", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" },
  { value: "5y", label: "5 Years" },
]

interface TimeframeSelectorProps {
  onTimeframeChange: (timeframe: string) => void
  currentTimeframe: string
}

export default function TimeframeSelector({ onTimeframeChange, currentTimeframe }: TimeframeSelectorProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Select Timeframe</label>
      <div className="flex flex-wrap gap-2">
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe.value}
            variant={currentTimeframe === timeframe.value ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeframeChange(timeframe.value)}
            className={cn(
              "flex-1 min-w-[80px]",
              currentTimeframe === timeframe.value ? "bg-primary text-primary-foreground" : "bg-background",
            )}
          >
            {timeframe.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
