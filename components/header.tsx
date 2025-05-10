import { ModeToggle } from '@/components/mode-toggle';
import { MessageSquareText, Bug } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xl font-semibold">
            <div className="flex items-center">
              <MessageSquareText className="mr-1 h-6 w-6 text-primary" />
              <Bug className="h-6 w-6 text-destructive" />
            </div>
            <span>Feedback Hub</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
