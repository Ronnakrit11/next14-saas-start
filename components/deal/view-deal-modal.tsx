"use client";

import { Dispatch, SetStateAction } from "react";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface Deal {
  id: string;
  title: string;
  price: number;
  status: "PENDING" | "PAID";
  createdAt: string;
}

interface ViewDealModalProps {
  deal: Deal | null;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export function ViewDealModal({ deal, showModal, setShowModal }: ViewDealModalProps) {
  if (!deal) return null;

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-urban text-2xl font-bold">View Deal</h3>
          <p className="text-sm text-muted-foreground">
            Details of your deal
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
              <p className="text-base">{deal.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
              <p className="text-base">฿{deal.price.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <Badge variant={deal.status === "PAID" ? "default" : "secondary"}>
                {deal.status}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
              <p className="text-base">{formatDate(deal.createdAt)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Deal ID</h4>
              <p className="text-base font-mono">{deal.id}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}