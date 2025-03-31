import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";
import { CreateAffiliateButton } from "@/components/affiliate/create-affiliate-button";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Affiliate Users – FairFlows",
  description: "Manage your affiliate users and track their performance",
});

export default async function AffiliateUsersPage({ params }: { params: { projectSlug: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch affiliate users
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

  // Calculate total commission earned (this is a placeholder - you'll need to implement actual commission tracking)
  const totalCommission = 0;
  const activeAffiliates = affiliates.length;
  const pendingCommission = 0;

  return (
    <>
      <DashboardHeader
        heading="Affiliate Users"
        text="Manage your affiliate users and track their performance."
      >
        <CreateAffiliateButton />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Affiliates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAffiliates} active affiliates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Affiliates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAffiliates}</div>
            <p className="text-xs text-muted-foreground">
              {((activeAffiliates / affiliates.length) * 100).toFixed(1)}% of total affiliates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{pendingCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              To be paid out
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Affiliate Users</CardTitle>
        </CardHeader>
        <CardContent>
          {affiliates.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No affiliate users found.
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="border-b">
                      <td className="p-3">{affiliate.name}</td>
                      <td className="p-3">{affiliate.email}</td>
                      <td className="p-3">{formatDate(affiliate.createdAt.toString())}</td>
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