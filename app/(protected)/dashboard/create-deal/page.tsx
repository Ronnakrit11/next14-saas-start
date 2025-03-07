import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { DealList } from "@/components/deal/deal-list";

export const metadata = constructMetadata({
  title: "Create Deal – SaaS Starter",
  description: "Create a new deal",
});

export default async function CreateDealPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Create Deal"
        text="Create and manage your deals."
      />
      <div className="grid gap-8">
        <DealList />
      </div>
    </>
  );
}