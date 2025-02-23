"use client";

import { useState, useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { PaymentModal } from "../modals/payment-modal";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();
  let [showModal, setShowModal] = useState(false);
  let [amount, setAmount] = useState(0);

  const generateUserStripeSession = generateUserStripe.bind(
    null,
    offer.stripeIds[year ? "yearly" : "monthly"],
  );

  const stripeSessionAction = () => {
    startTransition(async () => await generateUserStripeSession());
  }
  // startTransition(async () => await generateUserStripeSession());

  const fetchPromtpay = (offer: SubscriptionPlan) => {
    setShowModal(true)
  };


  const userOffer =
    subscriptionPlan.stripePriceId ===
    offer.stripeIds[year ? "yearly" : "monthly"];

  return (
    <>
      {
        showModal && <PaymentModal
          amount={offer.prices.monthly}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      }

      <Button
        variant={userOffer ? "default" : "outline"}
        rounded="full"
        className="w-full"
        disabled={isPending}
        onClick={() => fetchPromtpay(offer)}
      >
        {isPending ? (
          <>
            <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
          </>
        ) : (
          <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
        )}
      </Button>
    </>
  );
}
