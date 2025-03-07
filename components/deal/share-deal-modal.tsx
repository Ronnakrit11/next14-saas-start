"use client";

import { Dispatch, SetStateAction } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import { absoluteUrl } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  price: number;
  status: "PENDING" | "PAID";
  createdAt: string;
}

interface ShareDealModalProps {
  deal: Deal | null;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export function ShareDealModal({ deal, showModal, setShowModal }: ShareDealModalProps) {
  if (!deal) return null;

  const dealUrl = absoluteUrl(`/deals/${deal.id}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(dealUrl);
      toast.success("Deal link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: deal.title,
          text: `Check out this deal: ${deal.title}`,
          url: dealUrl,
        });
        toast.success("Deal shared successfully");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share deal");
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-urban text-2xl font-bold">Share Deal</h3>
          <p className="text-sm text-muted-foreground">
            Share this deal with others
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Deal Link</h4>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 truncate rounded-md border bg-muted/50 px-3 py-2 text-sm">
                  {dealUrl}
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="icon"
                >
                  <Icons.copy className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={handleShare} className="w-full">
                <Icons.share className="mr-2 size-4" />
                Share Deal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}