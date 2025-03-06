"use client";

import { Dispatch, SetStateAction } from "react";
import { Modal } from "@/components/ui/modal";
import { EditDealForm } from "../forms/edit-deal-form";
interface Deal {
  id: string;
  title: string;
  price: number;
  createdAt: string;
}

interface EditDealModalProps {
  deal: Deal | null;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onSuccess: (deal: Deal) => void;
}

export function EditDealModal({ deal, showModal, setShowModal, onSuccess }: EditDealModalProps) {
  if (!deal) return null;

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-urban text-2xl font-bold">Edit Deal</h3>
          <p className="text-sm text-muted-foreground">
            Update the details of your deal
          </p>
        </div>

        <div className="px-4 py-8 md:px-16">
          <EditDealForm deal={deal} onSuccess={onSuccess} />
        </div>
      </div>
    </Modal>
  );
}