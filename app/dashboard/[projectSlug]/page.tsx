import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { redirect } from "next/navigation";
import { CreateDealButton } from "@/components/deal/create-deal-button";
import { DealList } from "@/components/deal/deal-list";

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

  return (
    <MaxWidthWrapper>
      <div className="py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your deals for this project
            </p>
          </div>
          <CreateDealButton projectId={project.id} />
        </div>

        <div className="grid gap-6">
          <DealList />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}