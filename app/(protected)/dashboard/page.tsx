import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { Icons } from "@/components/shared/icons";
import ProjectSwitcher from "@/components/dashboard/project-switcher";

export const metadata = constructMetadata({
  title: "Dashboard – SaaS Starter",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  // Fetch all projects for the user with their associated deals
  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    include: {
      deals: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role : ${user?.role}`}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <ProjectSwitcher />
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/create-deal">
              <Icons.add className="mr-2 size-4" />
              Create Deal
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <Card className="col-span-full sm:col-auto">
            <CardHeader>
              <CardTitle>No Projects</CardTitle>
              <CardDescription>
                Click the "New Project" button in the project switcher to create your first project.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`size-4 rounded-full ${project.color}`} />
                    <Link href={`/dashboard/${project.slug}`}>
                      <CardTitle className="text-base hover:underline sm:text-lg">{project.title}</CardTitle>
                    </Link>
                  </div>
                  <Button className="w-full sm:w-auto" variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/${project.slug}`}>
                      View Deals
                    </Link>
                  </Button>
                </div>
                <CardDescription className="mt-2">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Deals:</span>
                    <span className="font-medium">{project.deals.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium">
                      ฿{project.deals.reduce((sum, deal) => sum + deal.price, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending Deals:</span>
                    <span className="font-medium">
                      {project.deals.filter(deal => deal.status === "PENDING").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Paid Deals:</span>
                    <span className="font-medium">
                      {project.deals.filter(deal => deal.status === "PAID").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}