import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }


  try {
    const userIdPrefix = "saas";
    const userId = `${userIdPrefix}-${currentUser.id}`;

    const response = await fetch(
      "https://payment-gw.expert8apisolutions.com/topup/current",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate QR code");
    }

    return new Response(JSON.stringify(data), { status: 200 });

    // console.log("Getting user data...");
    // const user = await prisma.user.findFirst({
    //   where: {
    //     id: currentUser.id,
    //   },
    //   select: {
    //     id: true,
    //     email: true,
    //     createdAt: true,
    //     updatedAt: true,
    //   },
    // });
    // console.log("🚀 ~ GET ~ user:", user);
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

});
