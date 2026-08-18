import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateFieldProps {
  /** ISO date string (yyyy-MM-dd) */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateField({ value, onChange, placeholder = "Pick a date", className }: DateFieldProps) {
  const date = value ? parseISO(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal text-foreground",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-icon" />
          {date ? format(date, "MMM d, yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
