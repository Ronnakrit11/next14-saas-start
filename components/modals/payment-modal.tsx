import { signIn } from "next-auth/react";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Icons } from "@/components/shared/icons";
import { Modal } from "@/components/ui/modal";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Socket, io } from 'socket.io-client';
import { Button } from "../ui/button";

const SOCKET_URL = 'https://payment-gw.expert8apisolutions.com';

interface TopupNotification {
    refId: string;
    status: 'COMPLETED' | 'EXPIRED';
    amount?: number;
    timestamp?: string;
}

// Define the socket events
interface ServerToClientEvents {
    'topup-status-update': (notification: TopupNotification) => void;
}

interface ClientToServerEvents {
    'subscribe-topup': (refId: string) => void;
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
    const [qrCode, setQrCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [refId, setRefId] = useState<string>('');
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [createAt, setCreateAt] = useState<string | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [currentAmount, setCurrentAmount] = useState<number>(amount);

    useEffect(() => {
        const socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL);

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socketInstance.on('connect_error', (error: Error) => {
            console.error('WebSocket connection error:', error);
            setError('Failed to connect to server');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !refId) return;

        // Subscribe to updates for this specific transaction
        socket.emit('subscribe-topup', refId);

        // Listen for status updates
        const handleStatusUpdate = (notification: TopupNotification) => {
            console.log('Received status update:', notification);

            if (notification.refId === refId) {
                if (notification.status === 'COMPLETED') {
                    setLoading(false);
                    setQrCode('');
                    setRefId('');
                    toast.success('Transaction completed', {
                        position: 'top-center',
                        duration: 10000,
                    });
                    setShowModal(false);
                } else if (notification.status === 'EXPIRED') {
                    setLoading(false);
                    setError('Transaction expired');
                    setQrCode('');
                    setRefId('');
                    toast.error('Transaction expired', {
                        position: 'top-center',
                    });
                }
            }
        };

        socket.on('topup-status-update', handleStatusUpdate);

        return () => {
            // Cleanup: unsubscribe from updates
            socket.off('topup-status-update', handleStatusUpdate);
        };
    }, [socket, refId]);


    useEffect(() => {
        fetchPromtpay()
    }, [currentAmount]);

    const fetchPromtpay = useCallback(async () => {
        try {
            if (!amount) {
                setError("กรุณาเลือกจำนวนเงิน");
                return;
            }
            setIsPending(true);
            
            const res = await fetch("/api/payment/promptpay?amount=" + amount, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (res.ok) {
                const { qrCode, refId, createdAt, amount } = await res.json();
                setQrCode(qrCode);
                setRefId(refId);
                setCreateAt(createdAt);
                setCurrentAmount(amount);
            } else {
                setError("เกิดข้อผิดพลาดในการสร้าง QR Code");
            }
            setIsPending(false);
        } catch (error) {
            console.error("Error generating QR code:", error);
            setError("Failed to generate QR code");
        }
    }, [currentAmount]);


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
                toast.info("ยกเลิกรายการเติมเงินแล้ว", {
                    position: "top-center",
                });
            } else {
                toast.error("เกิดข้อผิดพลาดในการยกเลิกรายการ");
            }
            setIsPending(false);
        } catch (err) {
            console.error("Error cancelling transaction:", err);
            toast.error("เกิดข้อผิดพลาดในการยกเลิกรายการ");
        }

    }


    return (
        <Modal showModal={showModal} setShowModal={setShowModal} preventDefaultClose hideClose>
            <div className="w-full">
                <div className=" bg-blue-900 flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
                    <h3 className="font-urban text-2xl font-bold">THAI QR PAYMENT</h3>
                </div>

                <div className="bg-white flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
                    <div className=" rounded-lg p-6 text-center">
                        {/* QR Code Display */}
                        <div className="flex justify-center mb-4">
                            {qrCode && <img src={qrCode} alt="QR Code" className="mx-auto" />}
                        </div>
                        {qrCode && amount && (
                            <div className="text-4xl font-bold mb-4 text-black">
                                {parseFloat(amount + "").toFixed(2)} บาท
                            </div>
                        )}

                        {
                            !!qrCode && <div>
                                <div className="text-blue-900 text-md font-bold mb-2">
                                    โปรดสแกน QR Code เพื่อชำระเงิน
                                </div>
                                <div className="text-xs text-gray-600 mb-2">
                                    หรือคัดลอกหมายเลขบัญชี PromptPay ด้านล่าง
                                </div>
                                <div className="text-3xl font-bold mb-4 text-black">
                                    081-234-5678
                                    <Icons.copy onClick={() => {
                                        navigator.clipboard.writeText("081-234-5678");
                                        toast.info("คัดลอกหมายเลขบัญชี PromptPay แล้ว", {
                                            position: "top-center",
                                        });
                                    }} className="inline-block ml-2 text-gray-500 cursor-pointer" />
                                </div>
                            </div>
                        }



                        {/* Loading Text */}
                        {qrCode && (
                            <div className="text-black text-sm font-bold mb-2">
                                กรุณาโอนเงินภายในเวลา

                                <div className="text-2xl font-bold text-red-500 mt-2">
                                    <CountdownTimer
                                        createdAt={createAt}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Loading Status */}
                        {qrCode && (
                            <div className="text-gray-600 text-xs">
                                ขณะเติมเงินอย่าปิดหรือยกเลิกรายการ<br />
                                ระบบกำลังตรวจสอบรายการ...
                                <Loader2 size={10} className="inline-block ml-2 animate-spin" />
                            </div>
                        )}

                        {/* Progress Bar */}
                        {loading && (
                            <div className="h-2 bg-gray-200 rounded">
                                <div className="w-1/3 h-full bg-blue-500 rounded"></div>
                            </div>
                        )}

                        {/* Cancel Button */}
                        {qrCode && (
                            <Button
                                disabled={isPending}
                                onClick={() => {
                                    cancelTransaction();
                                }}
                                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg text-lg"
                            >
                                {isPending ? (
                                    <>
                                        <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
                                    </>
                                ) : (
                                    <>ยกเลิกรายการ</>
                                )}
                            </Button>


                        )}

                        {/* Error Display */}
                        {error && (
                            <p className="text-red-500 mt-2">{error}</p>
                        )}
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
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div className="text-2xl font-bold text-red-500">
            {formattedTime}
        </div>
    );
};

export default CountdownTimer;