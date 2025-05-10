'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FeedbackFilters } from '@/lib/models/feedback';
import { MessageSquare, Bug, Filter } from 'lucide-react';

interface FiltersProps {
  filters: FeedbackFilters;
  onFiltersChange: (filters: FeedbackFilters) => void;
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const handleTypeChange = (value: string) => {
    if (value === 'ALL') {
      const newFilters = { ...filters };
      delete newFilters.type;
      onFiltersChange(newFilters);
    } else {
      onFiltersChange({ ...filters, type: value as 'REVIEW' | 'REPORT' });
    }
  };

  const handleReadStatusChange = (value: string) => {
    if (value === 'ALL') {
      const newFilters = { ...filters };
      delete newFilters.isRead;
      onFiltersChange(newFilters);
    } else {
      onFiltersChange({ ...filters, isRead: value === 'READ' });
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <h2 className="flex items-center gap-1.5 text-lg font-semibold">
          <Filter size={18} />
          Filters
        </h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <label htmlFor="type-filter" className="mb-1 text-sm text-muted-foreground">
              Type
            </label>
            <Select value={filters.type || 'ALL'} onValueChange={handleTypeChange}>
              <SelectTrigger id="type-filter" className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="REVIEW" className="flex items-center">
                  <span className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                    Reviews
                  </span>
                </SelectItem>
                <SelectItem value="REPORT">
                  <span className="flex items-center">
                    <Bug className="mr-2 h-4 w-4 text-amber-500" />
                    Reports
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="read-filter" className="mb-1 text-sm text-muted-foreground">
              Status
            </label>
            <Select
              value={filters.isRead !== undefined ? (filters.isRead ? 'READ' : 'UNREAD') : 'ALL'}
              onValueChange={handleReadStatusChange}
            >
              <SelectTrigger id="read-filter" className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="READ">Read</SelectItem>
                <SelectItem value="UNREAD">Unread</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={clearFilters} className="self-end">
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
