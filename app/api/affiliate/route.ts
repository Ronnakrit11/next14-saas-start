import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const { name, email, password } = json;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create affiliate user
    const affiliateUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "AFFILIATE",
        referrerId: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Affiliate user created successfully",
      user: {
        id: affiliateUser.id,
        name: affiliateUser.name,
        email: affiliateUser.email,
      },
    });

  } catch (error) {
    console.error("Error creating affiliate:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all affiliate users referred by the current user
    const affiliates = await prisma.user.findMany({
      where: {
        referrerId: session.user.id,
        role: "AFFILIATE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(affiliates);

  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}