"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import { EditDealModal } from "./edit-deal-modal";
import { ViewDealModal } from "./view-deal-modal";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ShareDealModal } from "./share-deal-modal";

interface Deal {
  id: string;
  title: string;
  price: number;
  status: "PENDING" | "PAID";
  createdAt: string;
  projectId: string;
}

export function DealList() {
  const params = useParams();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, [params.projectSlug]);

  const fetchDeals = async () => {
    try {
      const response = await fetch(`/api/deals?projectSlug=${params.projectSlug}`);
      if (!response.ok) throw new Error("Failed to fetch deals");
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error("Failed to fetch deals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowViewModal(true);
  };

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowEditModal(true);
  };

  const handleShare = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowShareModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete deal");
      }

      setDeals(deals.filter((deal) => deal.id !== id));
      toast.success("Deal deleted successfully");
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal");
    }
  };

  const handlePay = async (deal: Deal) => {
    // TODO: Implement payment logic
    toast.info("Payment functionality coming soon!");
  };

  const onEditSuccess = (updatedDeal: Deal) => {
    setDeals(deals.map(deal => deal.id === updatedDeal.id ? updatedDeal : deal));
    setShowEditModal(false);
    setSelectedDeal(null);
    toast.success("Deal updated successfully");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Mobile view card component
  const DealCard = ({ deal }: { deal: Deal }) => (
    <Card className="mb-4 p-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{deal.title}</h3>
          <Badge variant={deal.status === "PAID" ? "default" : "secondary"}>
            {deal.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          ฿{deal.price.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(deal.createdAt)}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {deal.status === "PENDING" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handlePay(deal)}
            >
              <Icons.billing className="size-4" />
              <span className="sr-only">Pay</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare(deal)}
          >
            <Icons.share className="size-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(deal)}
          >
            <Icons.eye className="size-4" />
            <span className="sr-only">View</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(deal)}
            disabled={deal.status === "PAID"}
          >
            <Icons.settings className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(deal.id)}
            disabled={deal.status === "PAID"}
          >
            <Icons.trash className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        {deals.length === 0 ? (
          <div className="text-center text-muted-foreground">No deals found</div>
        ) : (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No deals found
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>{deal.title}</TableCell>
                    <TableCell>฿{deal.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={deal.status === "PAID" ? "default" : "secondary"}>
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(deal.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {deal.status === "PENDING" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handlePay(deal)}
                          >
                            <Icons.billing className="size-4" />
                            <span className="sr-only">Pay</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(deal)}
                        >
                          <Icons.share className="size-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(deal)}
                        >
                          <Icons.eye className="size-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(deal)}
                          disabled={deal.status === "PAID"}
                        >
                          <Icons.settings className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(deal.id)}
                          disabled={deal.status === "PAID"}
                        >
                          <Icons.trash className="size-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ViewDealModal
        deal={selectedDeal}
        showModal={showViewModal}
        setShowModal={setShowViewModal}
      />

      <EditDealModal
        deal={selectedDeal}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        onSuccess={onEditSuccess}
      />

      <ShareDealModal
        deal={selectedDeal}
        showModal={showShareModal}
        setShowModal={setShowShareModal}
      />
    </>
  );
}