import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { redirect } from "next/navigation";

export default async function DealPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const deal = await prisma.deal.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!deal) {
    return (
      <MaxWidthWrapper>
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Deal not found</h1>
          <p className="mt-2 text-muted-foreground">
            The deal you are looking for does not exist.
          </p>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="py-10">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{deal.title}</h1>
              <p className="mt-2 text-muted-foreground">
                Created by {deal.user.name || deal.user.email}
              </p>
            </div>

            <div className="flex items-center justify-between border-y py-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-2xl font-bold">฿{deal.price.toLocaleString()}</p>
              </div>
              <Badge variant={deal.status === "PAID" ? "default" : "secondary"} className="text-base">
                {deal.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p>{formatDate(deal.createdAt.toISOString())}</p>
            </div>

            {deal.status === "PENDING" && (
              <div className="flex justify-end">
                <Button size="lg">
                  Pay Now
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}