import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";

interface ProjectPageProps {
  params: {
    projectSlug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
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
    <>
      <DashboardHeader
        heading={project.title}
        text={`View and manage ${project.title}`}
      />
      <div className="grid gap-8">
        {/* Add your project-specific content here */}
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-medium">Project Details</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Project slug: {project.slug}
          </p>
          <p className="text-sm text-muted-foreground">
            Created at: {project.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}