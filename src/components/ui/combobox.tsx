"use client"

import * as React from "react"
import { ChevronsUpDown, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  noResultsText = "No results found.",
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="p-2">
            <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
            />
        </div>
        <ScrollArea className="h-72">
            <div className="p-2 pt-0">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-normal h-auto py-2 text-left",
                            value === option.value && "font-bold"
                        )}
                        onClick={() => {
                            onChange(option.value)
                            setOpen(false)
                            setSearch("")
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            value === option.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        <span className="flex-1">{option.label}</span>
                    </Button>
                    ))
                ) : (
                    <p className="p-2 text-center text-sm text-muted-foreground">{noResultsText}</p>
                )}
            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
