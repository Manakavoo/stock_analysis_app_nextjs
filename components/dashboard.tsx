// "use client"

// import { useState, useEffect } from "react"
// import { ThemeToggle } from "@/components/theme-toggle"
// import StockSelector from "@/components/stock-selector"
// import TimeframeSelector from "@/components/timeframe-selector"
// import MetricsCards from "@/components/metrics-cards"
// import ChartContainer from "@/components/chart-container"
// import IndicatorTabs from "@/components/indicator-tabs"
// import Chatbot from "@/components/chatbot"
// import { useToast } from "@/hooks/use-toast"

// export type StockData = {
//   open: number
//   high: number
//   low: number
//   close: number
//   volume: number
//   trend: string
//   candlestick: any[]
//   rsi: any[]
//   macd: any[]
//   parameters: any[]
// }

// export default function Dashboard() {
//   const [stockSymbol, setStockSymbol] = useState<string>("^NSEI")
//   const [timeframe, setTimeframe] = useState<string>("3mo")
//   const [stockData, setStockData] = useState<StockData | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [activeIndicators, setActiveIndicators] = useState<string[]>(["candlestick"])
//   const { toast } = useToast()

//   // Update the fetchStockData function to include better error handling and fallback data
//   const fetchStockData = async () => {
//     setLoading(true)
//     try {
//       // Try to fetch data from the API
//       const response = await fetch(`http://127.0.0.1:8000/?index=${stockSymbol}&timeframe=${timeframe}`, {
//         // Add CORS mode to handle cross-origin issues
//         mode: "cors",
//         headers: {
//           Accept: "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Server responded with status: ${response.status}`)
//       }

//       const data = await response.json()

//       setStockData(data)
//       console.log("Fetched stock data:", data)
//     } catch (error) {
//       console.error("Error fetching stock data:", error)

//       // Show a more detailed error message
//       toast({
//         title: "Connection Error",
//         description: "Could not connect to the backend server. Using sample data instead.",
//         variant: "destructive",
//       })

//       // Use fallback data when the API is unavailable
//       setStockData(getSampleStockData(stockSymbol, timeframe))
//     } finally {     
      
//       setLoading(false)
//     }
//   }

//   // Add a function to generate sample data when the API is unavailable
//   const getSampleStockData = (symbol: string, period: string): StockData => {
//     // Generate some random data based on the symbol and timeframe
//     const basePrice = symbol === "^NSEI" ? 22000 : 65000
//     const volatility = period === "1mo" ? 200 : period === "3mo" ? 500 : 1000

//     // Generate sample candlestick data
//     const candlestickData = Array.from({ length: 30 }, (_, i) => {
//       const date = new Date()
//       date.setDate(date.getDate() - (30 - i))

//       const open = basePrice + (Math.random() - 0.5) * volatility
//       const close = open + (Math.random() - 0.5) * (volatility / 2)
//       const high = Math.max(open, close) + Math.random() * (volatility / 4)
//       const low = Math.min(open, close) - Math.random() * (volatility / 4)

//       return {
//         x: date.getTime(),
//         y: [open, high, low, close],
//       }
//     })

//     // Generate sample RSI data
//     const rsiData = Array.from({ length: 30 }, (_, i) => {
//       const date = new Date()
//       date.setDate(date.getDate() - (30 - i))
//       return {
//         date: date.toISOString(),
//         value: 30 + Math.random() * 40, // RSI between 30 and 70
//       }
//     })

//     // Generate sample MACD data
//     const macdData = Array.from({ length: 30 }, (_, i) => {
//       const date = new Date()
//       date.setDate(date.getDate() - (30 - i))
//       const macdLine = (Math.random() - 0.5) * 20
//       const signalLine = macdLine + (Math.random() - 0.5) * 5
//       return {
//         date: date.toISOString(),
//         macdLine,
//         signalLine,
//         histogram: macdLine - signalLine,
//       }
//     })

//     return {
//       open: basePrice + (Math.random() - 0.5) * (volatility / 2),
//       high: basePrice + volatility / 2,
//       low: basePrice - volatility / 2,
//       close: basePrice + (Math.random() - 0.5) * (volatility / 2),
//       volume: Math.floor(1000000 + Math.random() * 10000000),
//       trend: Math.random() > 0.5 ? "Bullish" : "Bearish",
//       candlestick: candlestickData,
//       rsi: rsiData,
//       macd: macdData,
//       parameters: [],
//     }
//   }

//   useEffect(() => {
//     fetchStockData()
//   }, [stockSymbol, timeframe])

//   const handleStockChange = (symbol: string) => {
//     setStockSymbol(symbol)
//   }

//   const handleTimeframeChange = (newTimeframe: string) => {
//     setTimeframe(newTimeframe)
//   }

//   const toggleIndicator = (indicator: string) => {
//     setActiveIndicators((prev) => {
//       if (prev.includes(indicator)) {
//         return prev.filter((i) => i !== indicator)
//       } else {
//         return [...prev, indicator]
//       }
//     })
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Stock Market Analysis Dashboard</h1>
//         <ThemeToggle />
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <StockSelector onStockChange={handleStockChange} currentStock={stockSymbol} />
//         <TimeframeSelector onTimeframeChange={handleTimeframeChange} currentTimeframe={timeframe} />
//         <button
//           onClick={fetchStockData}
//           className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
//         >
//           Refresh Data
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//         </div>
//       ) : stockData ? (
//         <>
//           <MetricsCards data={stockData} />

//           <div className="mb-6">
//             <IndicatorTabs activeIndicators={activeIndicators} toggleIndicator={toggleIndicator} />
//           </div>

//           <ChartContainer
//             data={stockData}
//             activeIndicators={activeIndicators}
//             symbol={stockSymbol}
//             timeframe={timeframe}
//           />
//         </>
//       ) : (
//         <div className="text-center py-12">
//           <p>No data available. Please select a stock and timeframe.</p>
//         </div>
//       )}

//       <Chatbot stockSymbol={stockSymbol} timeframe={timeframe} />
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import StockSelector from "@/components/stock-selector"
import TimeframeSelector from "@/components/timeframe-selector"
import MetricsCards from "@/components/metrics-cards"
import ChartContainer from "@/components/chart-container"
import IndicatorTabs from "@/components/indicator-tabs"
import Chatbot from "@/components/chatbot"
import { useToast } from "@/hooks/use-toast"

export type StockData = {
  open: number
  high: number
  low: number
  close: number
  volume: number
  trend: string
  candlestick: any[]
  rsi: any[]
  macd: any[]
  parameters: any[]
}

export default function Dashboard() {
  const [stockSymbol, setStockSymbol] = useState<string>("^NSEI")
  const [timeframe, setTimeframe] = useState<string>("3mo")
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["candlestick"])
  const { toast } = useToast()

  // Generate sample RSI data
  const generateRSIData = (symbol: string, timeframe: string) => {
    const length = timeframe === "1mo" ? 30 : timeframe === "3mo" ? 90 : 180
    return Array.from({ length }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (length - i))
      return {
        date: date.toISOString(),
        value: 30 + Math.random() * 40, // RSI between 30 and 70
      }
    })
  }

  // Generate sample MACD data
  // const generateMACDData = (symbol: string, timeframe: string) => {
  //   const length = timeframe === "1mo" ? 30 : timeframe === "3mo" ? 90 : 180
  //   return Array.from({ length }, (_, i) => {
  //     const date = new Date()
  //     date.setDate(date.getDate() - (length - i))
  //     const macdLine = (Math.random() - 0.5) * 20
  //     const signalLine = macdLine + (Math.random() - 0.5) * 5
  //     return {
  //       date: date.toISOString(),
  //       macdLine,
  //       signalLine,
  //       histogram: macdLine - signalLine,
  //     }
  //   })
  // }

  // Generate sample MACD data
const generateMACDData = (symbol: string, timeframe: string) => {
  const length = timeframe === "1mo" ? 30 : timeframe === "3mo" ? 60 : 180
  return Array.from({ length }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (length - i))
    const macdLine = Number(((Math.random() - 0.5) * 20).toFixed(2))
    const signalLine = Number((macdLine + (Math.random() - 0.5) * 5).toFixed(2),)
    return {
      date: date.toISOString(),
      macdLine,
      signalLine,
      histogram: Number((macdLine - signalLine).toFixed(2)),
    }
  })
}

  // Process stock data to always include RSI and MACD
  const processStockData = (data: any): StockData => {
    return {
      ...data,
      rsi: generateRSIData(stockSymbol, timeframe),
      macd: generateMACDData(stockSymbol, timeframe),
    }
  }

  const fetchStockData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/?index=${stockSymbol}&timeframe=${timeframe}`, {
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      setStockData(processStockData(data))
    } catch (error) {
      console.error("Error fetching stock data:", error)
      toast({
        title: "Connection Error",
        description: "Could not connect to the backend server. Using sample data instead.",
        variant: "destructive",
      })

      // Generate complete sample data
      const basePrice = stockSymbol === "^NSEI" ? 22000 : 65000
      const volatility = timeframe === "1mo" ? 200 : timeframe === "3mo" ? 500 : 1000
      
      const candlestickData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (30 - i))
        const open = basePrice + (Math.random() - 0.5) * volatility
        const close = open + (Math.random() - 0.5) * (volatility / 2)
        const high = Math.max(open, close) + Math.random() * (volatility / 4)
        const low = Math.min(open, close) - Math.random() * (volatility / 4)
        return {
          x: date.getTime(),
          y: [open, high, low, close],
        }
      })

      setStockData({
        open: basePrice + (Math.random() - 0.5) * (volatility / 2),
        high: basePrice + volatility / 2,
        low: basePrice - volatility / 2,
        close: basePrice + (Math.random() - 0.5) * (volatility / 2),
        volume: Math.floor(1000000 + Math.random() * 10000000),
        trend: Math.random() > 0.5 ? "Bullish" : "Bearish",
        candlestick: candlestickData,
        rsi: generateRSIData(stockSymbol, timeframe),
        macd: generateMACDData(stockSymbol, timeframe),
        parameters: [],
      })
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [stockSymbol, timeframe])

  const handleStockChange = (symbol: string) => {
    setStockSymbol(symbol)
  }

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)
  }

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators((prev) => {
      if (prev.includes(indicator)) {
        return prev.filter((i) => i !== indicator)
      } else {
        return [...prev, indicator]
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Market Analysis and Insights</h1>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StockSelector onStockChange={handleStockChange} currentStock={stockSymbol} />
        <TimeframeSelector onTimeframeChange={handleTimeframeChange} currentTimeframe={timeframe} />
        <button
          onClick={fetchStockData}
          className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : stockData ? (
        <>
          <MetricsCards data={stockData} />

          <div className="mb-6">
            <IndicatorTabs activeIndicators={activeIndicators} toggleIndicator={toggleIndicator} />
          </div>

          <ChartContainer
            data={stockData}
            activeIndicators={activeIndicators}
            symbol={stockSymbol}
            timeframe={timeframe}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p>No data available. Please select a stock and timeframe.</p>
        </div>
      )}

      <Chatbot stockSymbol={stockSymbol} timeframe={timeframe} />
    </div>
  )
}