import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function AffiliateRedirectPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  // If user is an affiliate, redirect to the first project's commissions page
  if (user.role === "AFFILIATE") {
    // Fetch the first project to redirect to
    const projects = await prisma.project.findMany({
      where: {
        user: {
          referrals: {
            some: {
              id: user.id
            }
          }
        }
      },
      take: 1
    });
    
    if (projects && projects.length > 0) {
      redirect(`/dashboard/${projects[0].slug}/commissions`);
    } else {
      // If no projects found, redirect to a default page
      redirect("/dashboard/no-projects");
    }
  } else {
    // For regular users, redirect to affiliate management
    redirect("/dashboard");
  }
}