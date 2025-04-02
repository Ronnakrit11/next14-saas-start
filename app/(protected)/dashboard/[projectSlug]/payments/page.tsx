import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";

export const metadata = constructMetadata({
  title: "Payment History – FairFlows",
  description: "View your commission payment history",
});

export default async function PaymentsPage({ params }: { params: { projectSlug: string } }) {
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
  
  // Sample payment data (in a real app, this would come from the database)
  const payments = [
    { id: "1", amount: 450, status: "Paid", method: "Bank Transfer", date: "2023-05-20T00:00:00Z", reference: "PAY-123456" },
    { id: "2", amount: 320, status: "Paid", method: "PayPal", date: "2023-04-15T00:00:00Z", reference: "PAY-789012" },
    { id: "3", amount: 580, status: "Processing", method: "Bank Transfer", date: "2023-06-25T00:00:00Z", reference: "PAY-345678" },
  ];
  
  // Calculate metrics
  const totalPaid = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "Processing").reduce((sum, p) => sum + p.amount, 0);
  const lastPaymentDate = payments.filter(p => p.status === "Paid").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date;
  
  return (
    <>
      <DashboardHeader
        heading="Payment History"
        text="View your commission payment history"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total amount paid to you
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Payments being processed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastPaymentDate ? formatDate(lastPaymentDate) : "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              Date of most recent payment
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No payment history found.
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-3">{payment.reference}</td>
                      <td className="p-3">฿{payment.amount.toLocaleString()}</td>
                      <td className="p-3">{payment.method}</td>
                      <td className="p-3">
                        <Badge variant={payment.status === "Paid" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="p-3">{formatDate(payment.date)}</td>
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
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Payment Method</h3>
              <p className="text-sm text-muted-foreground">Bank Transfer (default)</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Payment Schedule</h3>
              <p className="text-sm text-muted-foreground">Monthly (paid on the 15th)</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Minimum Payout</h3>
              <p className="text-sm text-muted-foreground">฿500</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}