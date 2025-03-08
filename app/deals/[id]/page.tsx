import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default async function DealPage({ params }: { params: { id: string } }) {
  // Remove the auth check since we want this page to be public
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
      project: {
        select: {
          title: true,
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
              <p className="mt-1 text-sm text-muted-foreground">
                Project: {deal.project.title}
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

            <div className="flex justify-end">
              <Button asChild size="lg">
                <a href="https://www.facebook.com/experts8academy" target="_blank" rel="noopener noreferrer">
                  Contact FairFlows
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}