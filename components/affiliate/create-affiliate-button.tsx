"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { CreateAffiliateModal } from "./create-affiliate-modal";

export function CreateAffiliateButton() {
  const [showNewAffiliateModal, setShowNewAffiliateModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowNewAffiliateModal(true)}>
        <Icons.plus className="mr-2 size-4" />
        Add Affiliate
      </Button>
      <CreateAffiliateModal 
        showModal={showNewAffiliateModal} 
        setShowModal={setShowNewAffiliateModal} 
      />
    </>
  );
}