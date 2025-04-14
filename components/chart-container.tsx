"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StockData } from "./dashboard"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ChartContainerProps {
  data: StockData
  activeIndicators: string[]
  symbol: string
  timeframe: string
}

export default function ChartContainer({ data, activeIndicators, symbol, timeframe }: ChartContainerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Safety check for data
  if (!mounted || !data || !data.candlestick || !data.rsi || !data.macd) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Chart Data Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-center justify-center">
              <p>Chart data is not available or is in an incorrect format.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const candlestickOptions = {
    chart: {
      type: "candlestick",
      height: 350,
      id: "candles",
      toolbar: {
        autoSelected: "pan",
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    title: {
      text: `${symbol} Candlestick Chart (${timeframe})`,
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  }

  const rsiOptions = {
    chart: {
      type: "line",
      height: 160,
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "RSI Indicator",
      align: "left",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      borderColor: "#e0e0e0",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (value: number) => {
          return value.toFixed(0)
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: "#00E396",
          label: {
            borderColor: "#00E396",
            style: {
              color: "#fff",
              background: "#00E396",
            },
            text: "Oversold",
          },
        },
        {
          y: 70,
          borderColor: "#FF4560",
          label: {
            borderColor: "#FF4560",
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            text: "Overbought",
          },
        },
      ],
    },
  }

  const macdOptions = {
    chart: {
      type: "bar",
      height: 160,
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "MACD Indicator",
      align: "left",
    },
    stroke: {
      width: [2, 2, 5],
      curve: "smooth",
    },
    grid: {
      borderColor: "#e0e0e0",
    },
    xaxis: {
      type: "datetime",
    },
    legend: {
      show: true,
      position: "top",
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: -100,
              to: 0,
              color: "#F15B46",
            },
            {
              from: 0,
              to: 100,
              color: "#00E396",
            },
          ],
        },
      },
    },
  }

  // Prepare series data for MACD
  const macdSeries = [
    {
      name: "MACD Line",
      type: "line",
      data: data.macd.map((item: any) => ({
        x: new Date(item.date).getTime(),
        y: item.macdLine,
      })),
    },
    {
      name: "Signal Line",
      type: "line",
      data: data.macd.map((item: any) => ({
        x: new Date(item.date).getTime(),
        y: item.signalLine,
      })),
    },
    {
      name: "Histogram",
      type: "bar",
      data: data.macd.map((item: any) => ({
        x: new Date(item.date).getTime(),
        y: item.histogram,
      })),
    },
  ]

  return (
    <div className="space-y-6">
      {activeIndicators.includes("candlestick") && (
        <Card>
          <CardHeader>
            <CardTitle>Candlestick Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ReactApexChart
                options={candlestickOptions as any}
                series={[{ data: data.candlestick }]}
                type="candlestick"
                height={350}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeIndicators.includes("rsi") && (
        <Card>
          <CardHeader>
            <CardTitle>Relative Strength Index (RSI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ReactApexChart
                options={rsiOptions as any}
                series={[
                  {
                    name: "RSI",
                    data: data.rsi.map((item: any) => ({
                      x: new Date(item.date).getTime(),
                      y: item.value,
                    })),
                  },
                ]}
                type="line"
                height={360}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeIndicators.includes("macd") && (
        <Card>
          <CardHeader>
            <CardTitle>Moving Average Convergence Divergence (MACD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ReactApexChart options={macdOptions as any} series={macdSeries} type="line" height={360} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
