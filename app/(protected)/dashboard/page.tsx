"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { Icons } from "@/components/shared/icons";
import ProjectSwitcher from "@/components/dashboard/project-switcher";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  interface Project {
    id: string;
    slug: string;
    title: string;
    color: string;
    createdAt: string;
    deals?: Array<{ price: number; status: string; }>;
  }
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is an affiliate, redirect them to the first project's commissions page
    if (session?.user?.role === "AFFILIATE") {
      const fetchProjects = async () => {
        try {
          const response = await fetch("/api/projects");
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
              redirect(`/dashboard/${data[0].slug}/commissions`);
            }
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching projects:", error);
          setLoading(false);
        }
      };
      
      fetchProjects();
    } else {
      // For regular users, fetch projects to display
      const fetchProjects = async () => {
        try {
          const response = await fetch("/api/projects");
          if (response.ok) {
            const data = await response.json();
            setProjects(data);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching projects:", error);
          setLoading(false);
        }
      };
      
      fetchProjects();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <>
        <DashboardHeader
          heading="Dashboard"
          text="Loading..."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-1/2 rounded bg-muted"></div>
                <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 rounded bg-muted"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (!session?.user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role: ${session?.user?.role}`}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <ProjectSwitcher />
        </div>
      </DashboardHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <Card className="col-span-full sm:col-auto">
            <CardHeader>
              <CardTitle>No Projects</CardTitle>
              <CardDescription>
                Click the &quot;New Project&quot; button in the project switcher to create your first project.
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
                    <span className="font-medium">
                      {project.deals && Array.isArray(project.deals) ? project.deals.length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium">
                      ฿{project.deals && Array.isArray(project.deals) 
                          ? project.deals.reduce((sum, deal) => sum + deal.price, 0).toLocaleString() 
                          : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending Deals:</span>
                    <span className="font-medium">
                      {project.deals && Array.isArray(project.deals) 
                        ? project.deals.filter(deal => deal.status === "PENDING").length 
                        : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Paid Deals:</span>
                    <span className="font-medium">
                      {project.deals && Array.isArray(project.deals) 
                        ? project.deals.filter(deal => deal.status === "PAID").length 
                        : 0}
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