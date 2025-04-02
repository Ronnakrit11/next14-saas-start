import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Affiliate Dashboard – FairFlows",
  description: "Manage your affiliate commissions and track your performance",
});

export default async function AffiliateDashboardPage({ params }: { params: { projectSlug: string } }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  // Verify user is an affiliate
  if (user.role !== "AFFILIATE") {
    redirect(`/dashboard/${params.projectSlug}/overview`);
  }
  
  // Get referrer (the user who referred this affiliate)
  const referrer = await prisma.user.findFirst({
    where: {
      referrals: {
        some: {
          id: user.id
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
    redirect("/dashboard/no-projects");
  }
  
  const project = referrer.projects[0];
  
  // Get products for this project to calculate potential commissions
  const products = await prisma.product.findMany({
    where: {
      projectId: project.id
    }
  });
  
  // Calculate commission metrics (these would be real calculations in a production app)
  const totalEarnings = 1250; // Sample data
  const pendingCommissions = 350; // Sample data
  const completedDeals = 5; // Sample data
  const conversionRate = "12.5%"; // Sample data
  
  return (
    <>
      <DashboardHeader
        heading="Affiliate Dashboard"
        text="Track your performance and earnings"
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
      
      <Card className="mt-4">
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
    </>
  );
}