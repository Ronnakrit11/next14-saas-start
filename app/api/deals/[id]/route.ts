import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { dealFormSchema } from "@/lib/validations/deal";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const deal = await prisma.deal.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { message: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deal);

  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Verify deal exists and belongs to user
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { message: "Deal not found" },
        { status: 404 }
      );
    }

    // Prevent editing if deal is already paid
    if (existingDeal.status === "PAID") {
      return NextResponse.json(
        { message: "Cannot edit a paid deal" },
        { status: 403 }
      );
    }

    // Prevent changing status to PAID
    if (body.status === "PAID") {
      return NextResponse.json(
        { message: "Status cannot be changed to PAID manually" },
        { status: 403 }
      );
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

    return NextResponse.json({
      message: "Deal updated successfully",
      deal: updatedDeal,
    });
  } catch (error) {
    console.error("Deal update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: "Validation error",
        errors: error.errors,
      }, { status: 422 });
    }

    return NextResponse.json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Verify deal exists and belongs to user
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { message: "Deal not found" },
        { status: 404 }
      );
    }

    // Prevent deleting if deal is already paid
    if (existingDeal.status === "PAID") {
      return NextResponse.json(
        { message: "Cannot delete a paid deal" },
        { status: 403 }
      );
    }

    await prisma.deal.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Deal deletion error:", error);

    return NextResponse.json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}