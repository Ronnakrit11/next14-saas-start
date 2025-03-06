"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { CreateDealModal } from "./create-deal-modal";

export function CreateDealButton() {
  const [showNewDealModal, setShowNewDealModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowNewDealModal(true)}>
        <Icons.plus className="mr-2 size-4" />
        Create Deal
      </Button>
      <CreateDealModal 
        showModal={showNewDealModal} 
        setShowModal={setShowNewDealModal} 
      />
    </>
  );
}