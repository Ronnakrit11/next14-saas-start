import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { redirect } from "next/navigation";
import { CreateDealButton } from "@/components/deal/create-deal-button";

export default async function ProjectPage({ params }: { params: { projectSlug: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const project = await prisma.project.findFirst({
    where: {
      slug: params.projectSlug,
      userId: session.user.id,
    },
  });

  if (!project) {
    redirect("/dashboard");
  }

  const deals = await prisma.deal.findMany({
    where: {
      userId: session.user.id,
      projectId: project.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <MaxWidthWrapper>
      <div className="py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="mt-2 text-muted-foreground">
              Created on {formatDate(project.createdAt.toISOString())}
            </p>
          </div>
          <CreateDealButton projectId={project.id} />
        </div>

        <div className="grid gap-6">
          {deals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No deals created yet.</p>
            </Card>
          ) : (
            deals.map((deal) => (
              <Card key={deal.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{deal.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ฿{deal.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={deal.status === "PAID" ? "default" : "secondary"}>
                      {deal.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(deal.createdAt.toISOString())}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}