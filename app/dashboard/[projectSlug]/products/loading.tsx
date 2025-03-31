import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Products"
        text="Manage your products and inventory."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="mt-4 h-[500px] w-full rounded-lg" />
    </>
  );
}