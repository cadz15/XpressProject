import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { useEcho } from "@laravel/echo-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    CreditCard,
    ArrowRight,
} from "lucide-react";

const WaitingForPayment = ({ subscriptionId }) => {
    const { auth } = usePage().props;
    const [redirectLink, setRedirectLink] = useState(route("dashboard"));
    const [status, setStatus] = useState("processing"); // processing, success, failed
    const [dots, setDots] = useState("");

    const user = auth.user;

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // useEcho("notification", ".test.notification", (e) => {
    //     console.log(e.message);
    // });

    useEcho(`payment-status.${user.id}`, ".payment.status.updated", (e) => {
        console.log("Payment status update:", e);
        if (e.forEvent === "payment") {
            setRedirectLink(route("tokens.index"));
        }
        if (e.status === "success") {
            setStatus("success");
        } else if (e.status === "failed") {
            setStatus("failed");
        }
    });

    const handleRetry = () => {
        router.replace(redirectLink);
    };

    const handleClose = () => {
        router.replace(redirectLink);
    };

    useEffect(() => {
        if (status === "success") {
            setTimeout(() => {
                router.replace(redirectLink);
            }, 3000);
        }
    }, [status]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 animate-fade-in">
            <Card className="w-full max-w-md shadow-xl border-0">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        {status === "processing" && (
                            <div className="relative">
                                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                </div>
                                <div className="absolute -top-1 -right-1">
                                    <Badge
                                        variant="secondary"
                                        className="animate-pulse"
                                    >
                                        <Clock className="h-3 w-3 mr-1" />
                                        Processing
                                    </Badge>
                                </div>
                            </div>
                        )}
                        {status === "success" && (
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                        )}
                        {status === "failed" && (
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                        )}
                    </div>

                    <CardTitle className="text-2xl">
                        {status === "processing" && `Processing Payment${dots}`}
                        {status === "success" && "Payment Successful!"}
                        {status === "failed" && "Payment Failed"}
                    </CardTitle>

                    <CardDescription>
                        {status === "processing" &&
                            "We're verifying your payment details. This may take a moment."}
                        {status === "success" &&
                            "Thank you for your purchase! Your subscription is now active."}
                        {status === "failed" &&
                            "We couldn't process your payment. Please try again."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Status-specific content */}
                    {status === "processing" && (
                        <Alert className="bg-blue-50 border-blue-200">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800">
                                Do not close this page
                            </AlertTitle>
                            <AlertDescription className="text-blue-700">
                                Please keep this window open while we process
                                your payment.
                            </AlertDescription>
                        </Alert>
                    )}

                    {status === "success" && (
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800">
                                Success!
                            </AlertTitle>
                            <AlertDescription className="text-green-700">
                                You will be redirected to your account shortly.
                            </AlertDescription>
                        </Alert>
                    )}

                    {status === "failed" && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Payment Failed</AlertTitle>
                            <AlertDescription>
                                Please check your payment details and try again.
                                If the problem persists, contact support.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Order Summary */}
                    <div className="rounded-lg bg-muted p-4">
                        <h4 className="font-medium text-sm mb-2">
                            Order Summary
                        </h4>
                        <div className="text-xs space-y-1 text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Subscription ID:</span>
                                <span className="font-mono">
                                    {subscriptionId}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>User:</span>
                                <span>{user.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <Badge
                                    variant={
                                        status === "success"
                                            ? "default"
                                            : status === "failed"
                                            ? "destructive"
                                            : "secondary"
                                    }
                                    className="text-xs"
                                >
                                    {status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                        {status === "failed" && (
                            <Button onClick={handleRetry} className="w-full">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        )}

                        {status === "success" && (
                            <Button
                                onClick={() => router.visit("/dashboard")}
                                className="w-full"
                            >
                                Go to Dashboard
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        )}

                        <Button
                            variant={status === "failed" ? "outline" : "ghost"}
                            onClick={handleClose}
                            className="w-full"
                        >
                            Close Window
                        </Button>
                    </div>

                    {/* Support Info */}
                    <div className="text-center text-xs text-muted-foreground">
                        Need help?{" "}
                        {/* <a
                            href="mailto:support@auctionapp.com"
                            className="text-primary hover:underline"
                        >
                            Contact support
                        </a> */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WaitingForPayment;
