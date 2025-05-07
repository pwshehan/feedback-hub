"use client"

import { useState, useEffect } from 'react';
import { FeedbackCard } from '@/components/feedback/feedback-card';
import { Pagination } from '@/components/feedback/pagination';
import { Filters } from '@/components/feedback/filters';
import { FeedbackResponse, FeedbackFilters, Feedback } from '@/lib/models/feedback';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function FeedbackList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { toast } = useToast();

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.isRead !== undefined) {
        params.append('isRead', filters.isRead.toString());
      }
      
      const response = await fetch(`/api/reviews?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedbackData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, limit, filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleFiltersChange = (newFilters: FeedbackFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/reviews/${id}/mark-read`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }
      
      // Update local state
      if (feedbackData) {
        const updatedFeedback = feedbackData.feedback.map((item) => 
          item._id?.toString() === id ? { ...item, isRead: true } : item
        );
        
        setFeedbackData({
          ...feedbackData,
          feedback: updatedFeedback,
        });
      }
      
      toast({
        title: "Successfully marked as read",
        description: "The feedback item has been updated.",
      });
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark feedback as read. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const renderFeedbackList = () => {
    if (isLoading) {
      // Loading skeleton
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ));
    }

    if (!feedbackData || feedbackData.feedback.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No feedback found</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            {Object.keys(filters).length > 0
              ? "Try adjusting your filters to see more results."
              : "There are no feedback items in the system yet."}
          </p>
        </div>
      );
    }

    return feedbackData.feedback.map((item: Feedback) => (
      <FeedbackCard 
        key={item._id?.toString()} 
        feedback={item} 
        onMarkAsRead={handleMarkAsRead}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Filters 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderFeedbackList()}
      </div>
      
      {feedbackData && feedbackData.feedback.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={feedbackData.totalPages}
          onPageChange={handlePageChange}
          limit={limit}
          onLimitChange={handleLimitChange}
          totalItems={feedbackData.totalCount}
        />
      )}
    </div>
  );
}