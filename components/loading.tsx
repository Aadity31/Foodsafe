import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({ message = 'Loading...', className }: LoadingPageProps) {
  return (
    <div className={cn('flex min-h-[400px] items-center justify-center', className)}>
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
  lines?: number;
}

export function LoadingCard({ className, lines = 3 }: LoadingCardProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3 animate-pulse rounded bg-muted"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

export function LoadingTable({ rows = 5, columns = 4 }: LoadingTableProps) {
  return (
    <div className="w-full space-y-2">
      {/* Table Header */}
      <div className="flex gap-2">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-8 flex-1 animate-pulse rounded bg-muted"
          />
        ))}
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex gap-2">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={`cell-${i}-${j}`}
              className="h-12 flex-1 animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <LoadingCard lines={5} />
        <LoadingCard lines={5} />
      </div>
    </div>
  );
}
