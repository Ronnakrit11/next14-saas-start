import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/");
  const refId = parts.at(-1) ?? "";

  try {
    const response = await fetch(
      `https://payment-gw.expert8apisolutions.com/topup/${refId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to cancel transaction");
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
});
