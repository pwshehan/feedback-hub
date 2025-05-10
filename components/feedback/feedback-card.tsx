'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Feedback } from '@/lib/models/feedback';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bug, Check, Star, Copy, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FeedbackCardProps {
  feedback: Feedback;
  onMarkAsRead: (id: string) => Promise<void>;
}

export function FeedbackCard({ feedback, onMarkAsRead }: FeedbackCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const isReview = feedback.type === 'REVIEW';
  const iconClass = isReview ? 'text-blue-500' : 'text-amber-500';
  const Icon = isReview ? MessageSquare : Bug;

  // Format the date
  const formattedDate = feedback.createdAt
    ? formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })
    : 'Unknown date';

  const handleMarkAsRead = async () => {
    if (feedback.isRead || !feedback._id) return;

    try {
      setIsLoading(true);
      await onMarkAsRead(feedback._id.toString());
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAccountId = async () => {
    try {
      await navigator.clipboard.writeText(feedback.account_id);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'Account ID has been copied to clipboard',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy account ID',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        !feedback.isRead && 'border-l-4',
        !feedback.isRead && isReview ? 'border-l-blue-500' : '',
        !feedback.isRead && !isReview ? 'border-l-amber-500' : ''
      )}
    >
      <CardHeader className="px-4 pb-2 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isReview ? 'default' : 'destructive'} className="font-normal">
              <Icon className={cn('mr-1 h-3 w-3', iconClass)} />
              {isReview ? 'Review' : 'Report'}
            </Badge>
            {feedback.isRead ? (
              <Badge variant="outline" className="bg-muted font-normal">
                <Check className="mr-1 h-3 w-3" />
                Read
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-blue-500/10 font-normal text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
              >
                New
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{formattedDate}</div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={copyAccountId}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary/80"
          >
            From: {feedback.username}
            {isCopied ? (
              <CheckCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {isReview && feedback.rating !== undefined && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={cn(
                    'fill-current',
                    index < feedback.rating!
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  )}
                />
              ))}
              <span className="ml-1 text-sm">({feedback.rating})</span>
            </div>
          )}
          <div className="mt-2 whitespace-pre-wrap text-sm">{feedback.message}</div>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-3 pt-0">
        {!feedback.isRead && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAsRead}
            disabled={isLoading}
            className="ml-auto mt-2"
          >
            <Check className="mr-1 h-4 w-4" />
            Mark as read
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
