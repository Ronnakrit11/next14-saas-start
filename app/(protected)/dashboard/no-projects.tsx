import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "No Projects – FairFlows",
  description: "You don't have any projects yet",
});

export default async function NoProjectsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return (
    <>
      <DashboardHeader
        heading="No Projects Available"
        text="You don't have access to any projects yet."
      />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Welcome to FairFlows</CardTitle>
          <CardDescription>
            You currently don&apos;t have access to any projects. This could be because:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc space-y-2 pl-5">
            <li>You haven&apos;t been added to any projects yet</li>
            <li>The project owner hasn&apos;t created any projects</li>
            <li>There might be an issue with your account permissions</li>
          </ul>
          
          <div className="pt-4">
            <p className="mb-4 text-muted-foreground">
              If you believe this is an error, please contact the project owner or support.
            </p>
            
            <Button asChild>
              <Link href="https://www.facebook.com/experts8academy" target="_blank">
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}