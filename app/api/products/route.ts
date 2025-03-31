import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

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

    // Get products for the specific project
    const products = await prisma.product.findMany({
      where: {
        userId: session.user.id,
        projectId: project.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
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

    if (!json.name || !json.price || !json.commission || !json.projectId) {
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

    // Create new product
    const product = await prisma.product.create({
      data: {
        name: json.name,
        price: json.price,
        commission: json.commission,
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json({ 
      message: "Product created successfully",
      product 
    });

  } catch (error) {
    console.error("Product creation error:", error);

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