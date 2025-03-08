import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { dealFormSchema } from "@/lib/validations/deal";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the project slug from the URL
    const { searchParams } = new URL(req.url);
    const projectSlug = searchParams.get("projectSlug");

    if (!projectSlug) {
      return NextResponse.json(
        { message: "Project slug is required" },
        { status: 400 }
      );
    }

    // First get the project
    const project = await prisma.project.findFirst({
      where: {
        slug: projectSlug,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Get deals for the specific project
    const deals = await prisma.deal.findMany({
      where: {
        userId: session.user.id,
        projectId: project.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { message: "Error fetching deals" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
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
        { message: "User not found" },
        { status: 404 }
      );
    }

    const json = await req.json();
    const body = dealFormSchema.parse(json);

    if (!body.title || !body.price || !json.projectId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: json.projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Force status to PENDING for new deals
    const deal = await prisma.deal.create({
      data: {
        title: body.title,
        price: parseFloat(body.price),
        status: "PENDING", // Always set to PENDING for new deals
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json({ 
      message: "Deal created successfully",
      deal 
    });

  } catch (error) {
    console.error("Deal creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 422 });
    }

    return NextResponse.json({ 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}