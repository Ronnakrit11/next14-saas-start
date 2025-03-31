import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { User } from "@prisma/client";

export const getCurrentUser = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    return undefined;
  }

  return {
    ...session.user,
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  } as User & {
    role: User["role"];
  };
});