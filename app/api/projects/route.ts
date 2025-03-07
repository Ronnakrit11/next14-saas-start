import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

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
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { title, slug, color } = json;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        color,
        userId: session.user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}