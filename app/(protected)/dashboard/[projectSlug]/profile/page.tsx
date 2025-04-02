import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = constructMetadata({
  title: "Profile Settings – FairFlows",
  description: "Manage your affiliate profile settings",
});

export default async function ProfileSettingsPage({ params }: { params: { projectSlug: string } }) {
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
  
  return (
    <>
      <DashboardHeader
        heading="Profile Settings"
        text="Manage your affiliate profile and payment information"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name || ""} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
              
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select id="paymentMethod" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="promptpay">PromptPay</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="Enter your bank name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="Enter your account number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="Enter the name on your account" />
              </div>
              
              <Button type="submit">Save Payment Information</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <input type="checkbox" id="emailNotifications" className="size-4 rounded border-gray-300" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">Receive email notifications about new deals and commissions</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="paymentNotifications">Payment Notifications</Label>
                  <input type="checkbox" id="paymentNotifications" className="size-4 rounded border-gray-300" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">Receive notifications when you receive a payment</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <input type="checkbox" id="marketingEmails" className="size-4 rounded border-gray-300" />
                </div>
                <p className="text-xs text-muted-foreground">Receive marketing emails about new features and promotions</p>
              </div>
              
              <Button type="submit">Save Preferences</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}