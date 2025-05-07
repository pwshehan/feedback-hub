import { Header } from '@/components/header';
import { FeedbackList } from '@/components/feedback/feedback-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Bug, BarChart, Activity } from 'lucide-react';
import { DashboardStats } from '@/components/dashboard-stats';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feedback Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage and analyze customer reviews and bug reports in one place.
            </p>
          </div>

          <DashboardStats />

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Feedback</TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-1">
                <Bug className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <FeedbackList />
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>
                    View and manage customer reviews and ratings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeedbackList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bug Reports</CardTitle>
                  <CardDescription>
                    View and manage bug reports from users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeedbackList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}