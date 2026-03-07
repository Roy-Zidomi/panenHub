import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 md:py-12">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border bg-card/80">
            <div className="aspect-square animate-pulse bg-muted" />
            <CardContent className="space-y-3 p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
