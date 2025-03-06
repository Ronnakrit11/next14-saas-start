import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Dashboard – SaaS Starter",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role : ${user?.role} — Change your role in settings.`}
      />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>No Deals Created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any deals yet. Start creating deals.
        </EmptyPlaceholder.Description>
        <Button>Add deals</Button>
      </EmptyPlaceholder>
    </>
  );
}
