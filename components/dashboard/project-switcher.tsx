"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

type ProjectType = {
  id: string;
  title: string;
  slug: string;
  color: string;
};

export default function ProjectSwitcher({
  large = false,
}: {
  large?: boolean;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [openPopover, setOpenPopover] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if user is an affiliate
  const isAffiliate = session?.user?.role === "AFFILIATE";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
        
        // Find and set the current project based on the URL slug
        if (params.projectSlug) {
          const currentProject = data.find(
            (project: ProjectType) => project.slug === params.projectSlug
          );
          if (currentProject) {
            setSelectedProject(currentProject);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProjects();
    }
  }, [session, params.projectSlug]);

  if (loading || !projects || status === "loading") {
    return <ProjectSwitcherPlaceholder />;
  }

  const handleCreateProject = async () => {
    if (!newProjectTitle) {
      toast.error("Please enter a project title");
      return;
    }

    // Create slug from title
    const slug = newProjectTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Define a set of distinct colors
    const projectColors = [
      'bg-blue-500',
      'bg-red-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];

    // Get colors already in use
    const usedColors = new Set(projects.map(p => p.color));
    
    // Filter out used colors
    const availableColors = projectColors.filter(color => !usedColors.has(color));
    
    // If all colors are used, start over with the full set
    const color = availableColors.length > 0 
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : projectColors[Math.floor(Math.random() * projectColors.length)];

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newProjectTitle,
          slug,
          color,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create project");
      }

      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setNewProjectTitle("");
      setOpenDialog(false);
      toast.success("Project created successfully!");
      router.push(`/dashboard/${newProject.slug}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    }
  };

  const handleProjectSelect = (project: ProjectType) => {
    setSelectedProject(project);
    setOpenPopover(false);
    router.push(`/dashboard/${project.slug}`);
    toast.success(`Switched to ${project.title}`);
  };

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            variant={openPopover ? "secondary" : "ghost"}
            size="sm" 
            className="w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedProject ? (
                <>
                  <div
                    className={cn(
                      "size-3 shrink-0 rounded-full",
                      selectedProject.color,
                    )}
                  />
                  <span
                    className={cn(
                      "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                      large ? "w-full" : "max-w-[80px]",
                    )}
                  >
                    {selectedProject.title}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                 เลือกร้านค้า
                </span>
              )}
            </div>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[200px] p-2">
          <div className="flex flex-col gap-1">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant="ghost"
                className="justify-between px-2 py-2.5"
                onClick={() => handleProjectSelect(project)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-3 shrink-0 rounded-full",
                      project.color,
                    )}
                  />
                  <span className="truncate text-sm">
                    {project.title}
                  </span>
                </div>
                {selectedProject?.id === project.id && (
                  <Check size={16} />
                )}
              </Button>
            ))}
            {!isAffiliate && (
              <Button
                variant="outline"
                className="mt-1 justify-start gap-2"
                onClick={() => setOpenDialog(true)}
              >
                <Plus size={16} />
                <span>New Project</span>
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter project title"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}