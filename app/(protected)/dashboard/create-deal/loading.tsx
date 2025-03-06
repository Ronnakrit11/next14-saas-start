import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function CreateDealLoading() {
  return (
    <>
      <DashboardHeader
        heading="Create Deal"
        text="Create and manage your deals."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}