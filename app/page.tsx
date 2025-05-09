import { Header } from '@/components/header';
import { FeedbackList } from '@/components/feedback/feedback-list';
import { DashboardStats } from '@/components/dashboard-stats';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feedback Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage and analyze customer reviews and bug reports in one place.
            </p>
          </div>

          <DashboardStats />

          <div className="space-y-4">
            <FeedbackList />
          </div>
        </div>
      </main>
    </div>
  );
}