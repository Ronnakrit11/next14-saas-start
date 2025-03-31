import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";
import { CreateProductButton } from "@/components/product/create-product-button";

export const metadata = constructMetadata({
  title: "Products – FairFlows",
  description: "Manage your products and inventory.",
});

export default async function ProductsPage({ params }: { params: { projectSlug: string } }) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  // Get project details
  const project = await prisma.project.findFirst({
    where: {
      slug: params.projectSlug,
      userId: user.id,
    },
    include: {
      products: true,
    },
  });

  if (!project) {
    redirect("/dashboard");
  }

  // Calculate product statistics
  const totalProducts = project.products.length;
  const totalSales = project.products.reduce((sum, product) => sum + product.price, 0);
  const totalCommission = project.products.reduce((sum, product) => sum + product.commission, 0);

  return (
    <>
      <DashboardHeader
        heading="Products"
        text="Manage your products and inventory."
      >
        <CreateProductButton projectId={project.id} />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Icons.package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts === 0 ? "No products available yet" : `${totalProducts} products in total`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Icons.check className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts === 0 ? "No active products" : `${totalProducts} active products`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <Icons.banknote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalCommission === 0 ? "No commission earned yet" : "Total commission earned"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Icons.banknote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalSales === 0 ? "No sales yet" : "Total sales value"}
            </p>
          </CardContent>
        </Card>
      </div>

      {project.products.length === 0 ? (
        <EmptyPlaceholder className="mt-4">
          <EmptyPlaceholder.Icon name="package" />
          <EmptyPlaceholder.Title>No products</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You haven&apos;t added any products yet. Start adding products to manage your inventory.
          </EmptyPlaceholder.Description>
          <CreateProductButton projectId={project.id} />
        </EmptyPlaceholder>
      ) : (
        <div className="mt-4 rounded-md border">
          <div className="p-4">
            <h2 className="text-xl font-bold">Product List</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {project.products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">฿{product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commission:</span>
                        <span className="font-medium">฿{product.commission.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}