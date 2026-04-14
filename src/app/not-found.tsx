import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center space-y-5">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Compass size={24} />
          </div>
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you requested does not exist or may have been moved.
          </p>
          <Button asChild className="rounded-full font-bold px-8">
            <Link href="/">Back to NutriFlow</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
