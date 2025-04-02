import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommissionsLoading() {
  return (
    <>
      <DashboardHeader
        heading="My Commissions"
        text="Track your affiliate commissions and earnings."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[60px]" />
              <Skeleton className="mt-1 h-4 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <Skeleton className="h-6 w-[140px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </>
  );
}