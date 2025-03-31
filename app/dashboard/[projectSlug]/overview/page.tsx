import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@/lib/db";

export const metadata = constructMetadata({
  title: "Project Overview – FairFlows",
  description: "Overview of your project performance and statistics",
});

export default async function ProjectOverviewPage({ params }: { params: { projectSlug: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Get project details
  const project = await prisma.project.findFirst({
    where: {
      slug: params.projectSlug,
      userId: session.user.id,
    },
    include: {
      deals: true,
    },
  });

  if (!project) {
    redirect("/dashboard");
  }

  // Calculate project statistics
  const totalDeals = project.deals.length;
  const pendingDeals = project.deals.filter(deal => deal.status === "PENDING").length;
  const paidDeals = project.deals.filter(deal => deal.status === "PAID").length;
  const totalValue = project.deals.reduce((sum, deal) => sum + deal.price, 0);

  return (
    <>
      <DashboardHeader
        heading={project.title}
        text="Overview of your project performance and statistics."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              All deals in this project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeals}</div>
            <p className="text-xs text-muted-foreground">
              Deals awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidDeals}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total value of all deals
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            No recent activity found.
          </div>
        </CardContent>
      </Card>
    </>
  );
}