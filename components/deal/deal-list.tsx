"use client";

import { useEffect, useState } from "react";
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

interface Deal {
  id: string;
  title: string;
  price: number;
  createdAt: string;
}

export function DealList() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch("/api/deals");
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

  const onEditSuccess = (updatedDeal: Deal) => {
    setDeals(deals.map(deal => deal.id === updatedDeal.id ? updatedDeal : deal));
    setShowEditModal(false);
    setSelectedDeal(null);
    toast.success("Deal updated successfully");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>{deal.title}</TableCell>
                <TableCell>฿{deal.price.toLocaleString()}</TableCell>
                <TableCell>{formatDate(deal.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                    >
                      <Icons.settings className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(deal.id)}
                    >
                      <Icons.trash className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {deals.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No deals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </>
  );
}