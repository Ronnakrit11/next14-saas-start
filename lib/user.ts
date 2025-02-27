import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        emailVerified: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      }
    });

    // Set admin role only for specific email
    if (user && user.email === "ronnakritcheinvichai@gmail.com") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" }
      });
      user.role = "ADMIN";
    }

    return user;
  } catch {
    return null;
  }
};