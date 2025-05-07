import { ModeToggle } from '@/components/mode-toggle';
import { MessageSquareText, Bug } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xl font-semibold">
            <div className="flex items-center">
              <MessageSquareText className="h-6 w-6 text-primary mr-1" />
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