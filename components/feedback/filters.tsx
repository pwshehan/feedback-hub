"use client"

import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeChange = (value: string) => {
    if (value === 'ALL') {
      const { type, ...rest } = filters;
      onFiltersChange(rest);
    } else {
      onFiltersChange({ ...filters, type: value as 'REVIEW' | 'REPORT' });
    }
  };

  const handleReadStatusChange = (value: string) => {
    if (value === 'ALL') {
      const { isRead, ...rest } = filters;
      onFiltersChange(rest);
    } else {
      onFiltersChange({ ...filters, isRead: value === 'READ' });
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-1.5">
          <Filter size={18} />
          Filters
        </h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <label htmlFor="type-filter" className="text-sm text-muted-foreground mb-1">Type</label>
            <Select
              value={filters.type || 'ALL'}
              onValueChange={handleTypeChange}
            >
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
            <label htmlFor="read-filter" className="text-sm text-muted-foreground mb-1">Status</label>
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

          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="self-end"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}