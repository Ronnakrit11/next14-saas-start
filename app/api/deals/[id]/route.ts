import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { dealFormSchema } from "@/lib/validations/deal";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deal = await prisma.deal.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!deal) {
      return new Response(JSON.stringify({ message: "Deal not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(deal), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching deal:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await req.json();
    const body = dealFormSchema.parse(json);

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

    // Verify deal exists and belongs to user
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingDeal) {
      return new Response(JSON.stringify({ message: "Deal not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prevent editing if deal is already paid
    if (existingDeal.status === "PAID") {
      return new Response(JSON.stringify({ message: "Cannot edit a paid deal" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prevent changing status to PAID
    if (body.status === "PAID") {
      return new Response(JSON.stringify({ message: "Status cannot be changed to PAID manually" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedDeal = await prisma.deal.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        price: parseFloat(body.price),
        status: "PENDING", // Force status to remain PENDING
      },
    });

    return new Response(
      JSON.stringify({
        message: "Deal updated successfully",
        deal: updatedDeal,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Deal update error:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: error.errors,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Verify deal exists and belongs to user
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingDeal) {
      return new Response(JSON.stringify({ message: "Deal not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prevent deleting if deal is already paid
    if (existingDeal.status === "PAID") {
      return new Response(JSON.stringify({ message: "Cannot delete a paid deal" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.deal.delete({
      where: {
        id: params.id,
      },
    });

    return new Response(
      JSON.stringify({ message: "Deal deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Deal deletion error:", error);

    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}