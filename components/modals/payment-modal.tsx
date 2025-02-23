"use client";

import { signIn } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const SOCKET_URL = "https://payment-gw.expert8apisolutions.com";

interface TopupNotification {
  refId: string;
  status: "COMPLETED" | "EXPIRED";
  amount?: number;
  timestamp?: string;
}

interface ServerToClientEvents {
  "topup-status-update": (notification: TopupNotification) => void;
}

interface ClientToServerEvents {
  "subscribe-topup": (refId: string) => void;
}

export function PaymentModal({
  showModal,
  setShowModal,
  amount,
}: {
  showModal: boolean;
  amount: number;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [qrCode, setQrCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refId, setRefId] = useState<string>("");
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [createAt, setCreateAt] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentAmount, setCurrentAmount] = useState<number>(amount);

  useEffect(() => {
    const socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> =
      io(SOCKET_URL);

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketInstance.on("connect_error", (error: Error) => {
      console.error("WebSocket connection error:", error);
      setError("Failed to connect to server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !refId) return;

    socket.emit("subscribe-topup", refId);

    const handleStatusUpdate = (notification: TopupNotification) => {
      console.log("Received status update:", notification);

      if (notification.refId === refId) {
        if (notification.status === "COMPLETED") {
          setLoading(false);
          setQrCode("");
          setRefId("");
          toast.success("Transaction completed", {
            position: "top-center",
            duration: 10000,
          });
          setShowModal(false);
        } else if (notification.status === "EXPIRED") {
          setLoading(false);
          setError("Transaction expired");
          setQrCode("");
          setRefId("");
          toast.error("Transaction expired", {
            position: "top-center",
          });
        }
      }
    };

    socket.on("topup-status-update", handleStatusUpdate);

    return () => {
      socket.off("topup-status-update", handleStatusUpdate);
    };
  }, [socket, refId, setShowModal]);

  useEffect(() => {
    fetchPromtpay();
  }, [currentAmount]);

  const fetchPromtpay = useCallback(async () => {
    try {
      if (!amount) {
        setError("Please select an amount");
        return;
      }
      setIsPending(true);

      const res = await fetch("/api/payment/promptpay?amount=" + amount, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const { qrCode, refId, createdAt, amount } = await res.json();
        setQrCode(qrCode);
        setRefId(refId);
        setCreateAt(createdAt);
        setCurrentAmount(amount);
      } else {
        setError("Failed to generate QR Code");
      }
      setIsPending(false);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError("Failed to generate QR code");
    }
  }, [amount, currentAmount]);

  const cancelTransaction = async () => {
    try {
      setIsPending(true);
      const res = await fetch("/api/payment/promptpay/" + refId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setShowModal(false);
        toast.info("Transaction cancelled", {
          position: "top-center",
        });
      } else {
        toast.error("Failed to cancel transaction");
      }
      setIsPending(false);
    } catch (err) {
      console.error("Error cancelling transaction:", err);
      toast.error("Failed to cancel transaction");
    }
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      preventDefaultClose
      hideClose
    >
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-6 pt-8 text-center">
          <h3 className="font-urban text-2xl font-bold">THAI QR PAYMENT</h3>
        </div>

        <div className="flex flex-col space-y-4 bg-muted/50 px-4 py-8">
          <div className="rounded-lg p-6 text-center">
            {/* QR Code Display */}
            {qrCode && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={qrCode}
                  alt="QR Code"
                  className="mx-auto"
                  width={300}
                  height={300}
                />
              </div>
            )}

            {qrCode && amount && (
              <div className="mb-4 text-4xl font-bold">
                {parseFloat(amount + "").toFixed(2)} THB
              </div>
            )}

            {!!qrCode && (
              <div>
                <div className="mb-2 text-md font-bold text-blue-900">
                  Please scan QR Code to pay
                </div>
                <div className="mb-2 text-xs text-gray-600">
                  Or copy the PromptPay number below
                </div>
                <div className="mb-4 text-3xl font-bold">
                  081-234-5678
                  <Icons.copy
                    onClick={() => {
                      navigator.clipboard.writeText("081-234-5678");
                      toast.info("PromptPay number copied", {
                        position: "top-center",
                      });
                    }}
                    className="ml-2 inline-block h-6 w-6 cursor-pointer text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* Loading Text */}
            {qrCode && (
              <div className="mb-2 text-sm font-bold">
                Please transfer within
                <div className="mt-2 text-2xl font-bold text-red-500">
                  <CountdownTimer createdAt={createAt} />
                </div>
              </div>
            )}

            {/* Loading Status */}
            {qrCode && (
              <div className="text-xs text-gray-600">
                Do not close or cancel during payment
                <br />
                Verifying transaction...
                <Loader2 className="ml-2 inline-block h-2.5 w-2.5 animate-spin" />
              </div>
            )}

            {/* Cancel Button */}
            {qrCode && (
              <Button
                disabled={isPending}
                onClick={cancelTransaction}
                className="mt-6 rounded-lg bg-red-500 px-8 py-3 text-lg text-white hover:bg-red-600"
              >
                {isPending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Loading...
                  </>
                ) : (
                  <>Cancel Transaction</>
                )}
              </Button>
            )}

            {/* Error Display */}
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

const CountdownTimer = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const expiryTime = createdTime + (15 * 60 + 55) * 1000; // 15:55 in milliseconds
      const now = new Date().getTime();
      const difference = expiryTime - now;

      return Math.max(0, Math.floor(difference / 1000)); // Convert to seconds, minimum 0
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const intervalId = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      // Clear interval when timer reaches 0
      if (remaining <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [createdAt]);

  // Convert seconds to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Format time with leading zeros
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  return <div className="text-2xl font-bold text-red-500">{formattedTime}</div>;
};

export default CountdownTimer;