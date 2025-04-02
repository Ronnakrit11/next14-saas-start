import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";

export const metadata = constructMetadata({
  title: "My Referrals – FairFlows",
  description: "Track your referrals and their performance",
});

export default async function ReferralsPage({ params }: { params: { projectSlug: string } }) {
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
  
  // Sample referral data (in a real app, this would come from the database)
  const referrals = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "Active", earnings: 450, date: "2023-05-15T00:00:00Z" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "Pending", earnings: 0, date: "2023-06-20T00:00:00Z" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "Active", earnings: 320, date: "2023-04-10T00:00:00Z" },
  ];
  
  // Calculate metrics
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.status === "Active").length;
  const totalEarnings = referrals.reduce((sum, r) => sum + r.earnings, 0);
  
  return (
    <>
      <DashboardHeader
        heading="My Referrals"
        text="Track your referrals and their performance"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              People you&apos;ve referred
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Referrals generating commissions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings from Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings from referrals
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Referral List</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              You haven&apos;t referred anyone yet.
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Earnings</th>
                    <th className="p-3">Date Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b">
                      <td className="p-3">{referral.name}</td>
                      <td className="p-3">{referral.email}</td>
                      <td className="p-3">
                        <Badge variant={referral.status === "Active" ? "default" : "secondary"}>
                          {referral.status}
                        </Badge>
                      </td>
                      <td className="p-3">฿{referral.earnings.toLocaleString()}</td>
                      <td className="p-3">{formatDate(referral.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this link to earn commissions when people sign up and make purchases.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                {`${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${user.id}`}
              </div>
              <Badge>Copy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}