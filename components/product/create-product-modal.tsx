"use client";

import { Dispatch, SetStateAction } from "react";
import { Modal } from "@/components/ui/modal";
import { ProductForm } from "@/components/forms/product-form";
import { useRouter } from "next/navigation";

interface CreateProductModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  projectId: string;
}

export function CreateProductModal({ showModal, setShowModal, projectId }: CreateProductModalProps) {
  const router = useRouter();

  const handleSuccess = () => {
    setShowModal(false);
    router.refresh();
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-urban text-2xl font-bold">Create New Product</h3>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new product
          </p>
        </div>

        <div className="px-4 py-8 md:px-16">
          <ProductForm onSuccess={handleSuccess} projectId={projectId} />
        </div>
      </div>
    </Modal>
  );
}