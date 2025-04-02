import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = constructMetadata({
  title: "My Commissions – FairFlows",
  description: "Track your affiliate commissions and earnings",
});

export default async function CommissionsPage({ params }: { params: { projectSlug: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Verify user is an affiliate
  if (session.user.role !== "AFFILIATE") {
    redirect(`/dashboard/${params.projectSlug}/overview`);
  }

  // Get referrer (the user who referred this affiliate)
  const referrer = await prisma.user.findFirst({
    where: {
      referrals: {
        some: {
          id: session.user.id
        }
      }
    },
    include: {
      projects: {
        where: {
          slug: params.projectSlug
        }
      }
    }
  });

  if (!referrer || !referrer.projects.length) {
    redirect("/dashboard");
  }

  const project = referrer.projects[0];

  // Get products for this project to calculate potential commissions
  const products = await prisma.product.findMany({
    where: {
      projectId: project.id
    }
  });

  // Get deals that have been completed (PAID status) for this project
  // In a real application, you would track which deals were referred by this affiliate
  // For now, we'll just show sample data
  const deals = await prisma.deal.findMany({
    where: {
      projectId: project.id,
      status: "PAID"
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5
  });

  // Calculate commission metrics (these would be real calculations in a production app)
  const totalEarnings = 1250; // Sample data
  const pendingCommissions = 350; // Sample data
  const completedDeals = 5; // Sample data
  const conversionRate = "12.5%"; // Sample data

  return (
    <>
      <DashboardHeader
        heading="My Commissions"
        text="Track your affiliate commissions and earnings."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime commission earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{pendingCommissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              To be paid out soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDeals}</div>
            <p className="text-xs text-muted-foreground">
              Deals completed through your referrals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}</div>
            <p className="text-xs text-muted-foreground">
              Of referral visits to completed deals
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            {deals.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                No commission history found.
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-3">Deal</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Commission</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map((deal) => (
                      <tr key={deal.id} className="border-b">
                        <td className="p-3">{deal.title}</td>
                        <td className="p-3">฿{deal.price.toLocaleString()}</td>
                        <td className="p-3">฿{Math.round(deal.price * 0.1).toLocaleString()}</td>
                        <td className="p-3">{formatDate(deal.createdAt.toString())}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                No products available for commission.
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-3">{product.name}</td>
                        <td className="p-3">฿{product.price.toLocaleString()}</td>
                        <td className="p-3">฿{product.commission.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Your Affiliate Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this link with potential customers. You&apos;ll earn commission on any deals they complete.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                {`${process.env.NEXT_PUBLIC_APP_URL}/deals?ref=${session.user.id}`}
              </div>
              <Badge>Copy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}