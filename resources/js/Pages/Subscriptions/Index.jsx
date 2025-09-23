import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Loader2, Crown, Zap, Star, Check, X, CreditCard } from "lucide-react";

export default function SubscriptionIndex({ plans, activeSubscription }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleSubscribe = (planId) => {
        setIsLoading(true);
        setSelectedPlan(planId);
        router.post(
            `/subscriptions/start/${planId}`,
            {},
            {
                onFinish: () => {
                    setIsLoading(false);
                    setSelectedPlan(null);
                },
            }
        );
    };

    const handleCancel = () => {
        setIsLoading(true);
        router.post(
            `/subscriptions/cancel`,
            {},
            {
                onFinish: () => {
                    setIsLoading(false);
                    setShowCancelDialog(false);
                },
            }
        );
    };

    const getPlanIcon = (planName) => {
        if (planName.toLowerCase().includes("premium"))
            return <Crown className="h-6 w-6" />;
        if (planName.toLowerCase().includes("pro"))
            return <Zap className="h-6 w-6" />;
        return <Star className="h-6 w-6" />;
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "active":
                return "default";
            case "canceled":
                return "destructive";
            case "past_due":
                return "destructive";
            default:
                return "outline";
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="container max-w-6xl py-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full">
                        <Crown className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Subscription Plans
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Choose a plan that fits your needs. All plans include
                        exclusive benefits and features.
                    </p>
                </div>

                {/* Active Subscription Alert */}
                {activeSubscription && (
                    <Alert className="bg-green-50 border-green-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <AlertTitle className="text-green-800 flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    Active Subscription
                                </AlertTitle>
                                <AlertDescription className="text-green-700">
                                    You are subscribed to:{" "}
                                    <span className="font-semibold">
                                        {activeSubscription.plan.name}
                                    </span>
                                    <Badge
                                        variant={getStatusBadgeVariant(
                                            activeSubscription.status
                                        )}
                                        className="ml-2"
                                    >
                                        {activeSubscription.status.toUpperCase()}
                                    </Badge>
                                </AlertDescription>
                            </div>
                            <Button
                                onClick={() => setShowCancelDialog(true)}
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50 whitespace-nowrap"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel Subscription
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Subscription Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isCurrentPlan =
                            activeSubscription?.plan?.id === plan.id;
                        const isPopular =
                            plan.name.toLowerCase().includes("pro") ||
                            plan.name.toLowerCase().includes("premium");

                        return (
                            <Card
                                key={plan.id}
                                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                                    isPopular
                                        ? "border-primary ring-1 ring-primary"
                                        : ""
                                } ${
                                    isCurrentPlan ? "ring-2 ring-green-500" : ""
                                }`}
                            >
                                {isPopular && (
                                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                                        Most Popular
                                    </Badge>
                                )}

                                {isCurrentPlan && (
                                    <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                                        Current Plan
                                    </Badge>
                                )}

                                <CardHeader className="text-center pb-4">
                                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                                        {getPlanIcon(plan.name)}
                                    </div>
                                    <CardTitle className="text-xl">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-3xl font-bold">
                                            ${plan.price}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            /month
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {plan.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="pb-6">
                                    {plan.features && (
                                        <ul className="space-y-2">
                                            {plan.features.map(
                                                (feature, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={isLoading || isCurrentPlan}
                                        className="w-full"
                                        size="lg"
                                        variant={
                                            isPopular
                                                ? "default"
                                                : isCurrentPlan
                                                ? "outline"
                                                : "default"
                                        }
                                    >
                                        {isLoading &&
                                        selectedPlan === plan.id ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : isCurrentPlan ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                Current Plan
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                Subscribe Now
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* Additional Information */}
                <Card className="bg-muted/30 border-none">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">
                            Subscription Benefits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Zap className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Priority Access
                                    </p>
                                    <p className="text-muted-foreground mt-1">
                                        Get early access to new features and
                                        auctions
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Crown className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Exclusive Content
                                    </p>
                                    <p className="text-muted-foreground mt-1">
                                        Access to premium auctions and limited
                                        editions
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Star className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Reduced Fees</p>
                                    <p className="text-muted-foreground mt-1">
                                        Lower transaction fees on all your
                                        purchases
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Check className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Cancel Anytime
                                    </p>
                                    <p className="text-muted-foreground mt-1">
                                        No long-term commitment, cancel whenever
                                        you want
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cancel Subscription Dialog */}
                <Dialog
                    open={showCancelDialog}
                    onOpenChange={setShowCancelDialog}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <X className="h-5 w-5 text-destructive" />
                                Cancel Subscription
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to cancel your
                                subscription? You will lose access to all
                                premium features at the end of your billing
                                period.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <DialogClose asChild>
                                <Button variant="outline">
                                    Keep Subscription
                                </Button>
                            </DialogClose>
                            <Button
                                onClick={handleCancel}
                                disabled={isLoading}
                                variant="destructive"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel Subscription
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
