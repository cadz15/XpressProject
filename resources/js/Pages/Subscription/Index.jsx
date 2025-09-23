import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
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
} from "@/components/ui/dialog";
import {
    Loader2,
    Crown,
    Zap,
    Star,
    CircleX,
    Check,
    CreditCard,
    Shield,
    Users,
    Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Index({ plans, user, activeSubscription }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleCheckout = (planId, cancel = false) => {
        setIsLoading(true);
        setSelectedPlan(planId);

        axios
            .post(
                cancel
                    ? route("subscriptions.cancel")
                    : route("subscription.checkout"),
                {
                    plan_id: planId,
                },
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            )
            .then((response) => {
                const checkoutUrl = response.data.url;
                window.location.replace(checkoutUrl);
                setIsLoading(false);
                setSelectedPlan(null);
            })
            .catch((error) => {
                console.error("Error creating Stripe session:", error);
                setIsLoading(false);
                setSelectedPlan(null);
            });
    };

    const getPlanIcon = (planName) => {
        if (planName.toLowerCase().includes("premium"))
            return <Crown className="h-6 w-6" />;
        if (planName.toLowerCase().includes("pro"))
            return <Zap className="h-6 w-6" />;
        return <Star className="h-6 w-6" />;
    };

    const getPopularBadge = (plan, index) => {
        // Mark the middle plan as popular (or any logic you prefer)
        if (plans.length >= 3 && index === 1) {
            return (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                </Badge>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Subscription" />
            <div className="flex justify-center">
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
                            Choose a subscription plan to access premium
                            features and unlock the full potential of our
                            platform.
                        </p>
                    </div>

                    {/* Subscription Status Alert */}
                    {activeSubscription ? (
                        <Alert className="bg-green-50 border-green-200">
                            <Check className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800">
                                Active Subscription
                            </AlertTitle>
                            <AlertDescription className="text-green-700">
                                You have an active subscription. Thank you for
                                being a valued member!
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive">
                            <Shield className="h-4 w-4" />
                            <AlertTitle>Subscription Required</AlertTitle>
                            <AlertDescription>
                                You need an active subscription to access all
                                platform features. Please choose a plan below.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Subscription Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan, index) => {
                            const popularBadge = getPopularBadge(plan, index);
                            const isPopular = !!popularBadge;

                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
                                        isPopular
                                            ? "border-primary ring-1 ring-primary"
                                            : ""
                                    }`}
                                >
                                    {popularBadge}

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

                                        {activeSubscription && (
                                            <span className="text-sm flex justify-center">
                                                Renew at{" "}
                                                {formatDate(
                                                    activeSubscription.ends_at
                                                )}
                                            </span>
                                        )}
                                    </CardContent>

                                    <CardFooter>
                                        <Button
                                            onClick={() =>
                                                handleCheckout(
                                                    plan.id,
                                                    activeSubscription?.subscription_plan_id ===
                                                        plan.id
                                                )
                                            }
                                            disabled={
                                                isLoading ||
                                                (activeSubscription &&
                                                    activeSubscription?.subscription_plan_id !==
                                                        plan.id)
                                            }
                                            className="w-full"
                                            size="lg"
                                            variant={
                                                activeSubscription?.subscription_plan_id ===
                                                plan.id
                                                    ? "destructive"
                                                    : "default"
                                            }
                                        >
                                            {isLoading &&
                                            selectedPlan === plan.id ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : activeSubscription?.subscription_plan_id ===
                                              plan.id ? (
                                                <>
                                                    <CircleX className="h-4 w-4 mr-2" />
                                                    Cancel Subscription
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

                    {/* Benefits Section */}
                    <Card className="bg-muted/30 border-none">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-4 text-center">
                                Subscription Benefits
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="font-medium mb-2">
                                        Exclusive Access
                                    </h4>
                                    <p className="text-muted-foreground">
                                        Get access to premium auctions and
                                        limited edition items not available to
                                        regular users.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
                                        <Shield className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="font-medium mb-2">
                                        Priority Support
                                    </h4>
                                    <p className="text-muted-foreground">
                                        Receive dedicated customer support with
                                        faster response times and personalized
                                        assistance.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
                                        <Calendar className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="font-medium mb-2">
                                        Flexible Billing
                                    </h4>
                                    <p className="text-muted-foreground">
                                        Cancel anytime with no long-term
                                        commitment. Your subscription renews
                                        automatically each month.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Processing Dialog */}
                    <Dialog open={isLoading} onOpenChange={() => {}}>
                        <DialogContent className="sm:max-w-md" hideCloseButton>
                            <DialogHeader>
                                <DialogTitle className="text-center flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    Preparing Checkout
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    Please wait while we redirect you to our
                                    secure payment processor. This may take a
                                    few moments.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center mt-4">
                                <div className="w-3/4 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300 animate-pulse"
                                        style={{ width: "45%" }}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
