import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </main>
  );
}
