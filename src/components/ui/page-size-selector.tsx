import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PageSizeSelectorProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  className?: string;
}

export function PageSizeSelector({ pageSize, setPageSize, className }: PageSizeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 whitespace-nowrap ${className || ''}`}>
      <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Items per page:</span>
      <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 