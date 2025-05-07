import { ObjectId } from 'mongodb';

export type FeedbackType = 'REVIEW' | 'REPORT';

export interface Feedback {
  _id?: ObjectId;
  type: FeedbackType;
  account_id: string;
  username: string;
  message: string;
  rating?: number;
  createdAt: Date;
  isRead: boolean;
}

export interface FeedbackFilters {
  type?: FeedbackType;
  isRead?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface FeedbackResponse {
  feedback: Feedback[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}