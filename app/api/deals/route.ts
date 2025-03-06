import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { dealFormSchema } from "@/lib/validations/deal";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await req.json();
    const body = dealFormSchema.parse(json);

    if (!body.title || !body.price) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deal = await prisma.deal.create({
      data: {
        title: body.title,
        price: parseFloat(body.price),
        userId: user.id,
      },
    });

    return new Response(JSON.stringify({ 
      message: "Deal created successfully",
      deal 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Deal creation error:", error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        message: "Validation error", 
        errors: error.errors 
      }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deals = await prisma.deal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(deals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return new Response(JSON.stringify({ message: "Error fetching deals" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}