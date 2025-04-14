"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const predefinedIndices = [
  { value: "^NSEI", label: "NIFTY 50 (^NSEI)" },
  { value: "^BSESN", label: "BSE SENSEX (^BSESN)" },
]

interface StockSelectorProps {
  onStockChange: (symbol: string) => void
  currentStock: string
}

export default function StockSelector({ onStockChange, currentStock }: StockSelectorProps) {
  const [open, setOpen] = useState(false)
  const [customSymbol, setCustomSymbol] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(
    predefinedIndices.find((index) => index.value === currentStock)?.label || "",
  )

  const handleSelectIndex = (value: string) => {
    const selectedItem = predefinedIndices.find((index) => index.value === value)
    if (selectedItem) {
      setSelectedIndex(selectedItem.label)
      onStockChange(value)
      setOpen(false)
    }
  }

  const handleCustomSymbolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customSymbol.trim()) {
      onStockChange(customSymbol.trim())
      setSelectedIndex("")
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Select Stock Index</label>
      <div className="flex space-x-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
              {selectedIndex || "Select index..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search indices..." />
              <CommandList>
                <CommandEmpty>No index found.</CommandEmpty>
                <CommandGroup>
                  {predefinedIndices.map((index) => (
                    <CommandItem key={index.value} value={index.value} onSelect={handleSelectIndex}>
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedIndex === index.label ? "opacity-100" : "opacity-0")}
                      />
                      {index.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <form onSubmit={handleCustomSymbolSubmit} className="flex space-x-2">
        <Input
          placeholder="Or enter custom symbol..."
          value={customSymbol}
          onChange={(e) => setCustomSymbol(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Apply</Button>
      </form>
    </div>
  )
}
