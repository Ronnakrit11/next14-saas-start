"use client";

import { Dispatch, SetStateAction } from "react";
import { Modal } from "@/components/ui/modal";
import { DealForm } from "@/components/forms/deal-form";

interface CreateDealModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  projectId: string;
}

export function CreateDealModal({ showModal, setShowModal, projectId }: CreateDealModalProps) {
  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-urban text-2xl font-bold">Create New Deal</h3>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new deal
          </p>
        </div>

        <div className="px-4 py-8 md:px-16">
          <DealForm onSuccess={() => setShowModal(false)} projectId={projectId} />
        </div>
      </div>
    </Modal>
  );
}