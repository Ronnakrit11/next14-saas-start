import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // If user is an affiliate, get projects they're associated with
    if (session.user.role === "AFFILIATE") {
      const referrer = await prisma.user.findFirst({
        where: {
          referrals: {
            some: {
              id: session.user.id
            }
          }
        }
      });

      if (!referrer) {
        return NextResponse.json(
          { error: "No referrer found" },
          { status: 404 }
        );
      }

      const projects = await prisma.project.findMany({
        where: {
          userId: referrer.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(projects);
    }

    // For regular users, get their own projects
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is an affiliate - affiliates cannot create projects
    if (session.user.role === "AFFILIATE") {
      return NextResponse.json(
        { error: "Affiliate users cannot create projects" },
        { status: 403 }
      );
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const json = await req.json();
    const { title, slug, color } = json;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if project with same slug exists
    const existingProject = await prisma.project.findUnique({
      where: {
        slug: slug,
      },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new project
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        color: color || "bg-blue-500", // Default color if none provided
        userId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}