"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  popoverClassName?: string
  calendarClassName?: string
}

export function DatePicker({ date, onSelect, popoverClassName, calendarClassName }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", popoverClassName)} align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => onSelect(newDate || undefined)}
          initialFocus
          className={calendarClassName}
        />
      </PopoverContent>
    </Popover>
  )
} 