import { redirect } from "next/navigation";

import { projectSidebarLinks } from "@/config/project-dashboard";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export default async function ProjectLayout({ children, params }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  // Verify project exists and belongs to user
  const project = await prisma.project.findFirst({
    where: {
      slug: params.slug,
      userId: user.id,
    },
  });

  if (!project) {
    redirect("/dashboard");
  }

  // Convert relative paths to absolute paths with current project slug
  const linksWithProjectSlug = projectSidebarLinks.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      href: `/project/${params.slug}${item.href}`
    }))
  }));

  const filteredLinks = linksWithProjectSlug.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
    ),
  }));

  return (
    <div className="relative flex min-h-screen w-full">
      <DashboardSidebar links={filteredLinks} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8">
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
            <MobileSheetSidebar links={filteredLinks} />

            <div className="w-full flex-1">
              <SearchCommand links={filteredLinks} />
            </div>

            <ModeToggle />
            <UserAccountNav />
          </MaxWidthWrapper>
        </header>

        <main className="flex-1 p-4 xl:px-8">
          <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}