"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { CreateProductModal } from "./create-product-modal";

interface CreateProductButtonProps {
  projectId: string;
}

export function CreateProductButton({ projectId }: CreateProductButtonProps) {
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowNewProductModal(true)}>
        <Icons.plus className="mr-2 size-4" />
        Add Product
      </Button>
      <CreateProductModal 
        showModal={showNewProductModal} 
        setShowModal={setShowNewProductModal} 
        projectId={projectId}
      />
    </>
  );
}