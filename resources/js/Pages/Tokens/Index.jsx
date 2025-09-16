import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Coins,
    CreditCard,
    Sparkles,
    Check,
    Zap,
    Crown,
    Loader2,
} from "lucide-react";

export default function Index({ bundles }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBundle, setLoadingBundle] = useState(null);

    const handleCheckout = (bundleId) => {
        setIsLoading(true);
        setLoadingBundle(bundleId);

        axios
            .post(route("tokens.checkout", bundleId), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            })
            .then((response) => {
                const checkoutUrl = response.data.url;
                if (checkoutUrl) {
                    window.location.replace(checkoutUrl);
                }
                setIsLoading(false);
                setLoadingBundle(null);
            })
            .catch((error) => {
                console.error("Error creating Stripe session:", error);
                setIsLoading(false);
                setLoadingBundle(null);
            });
    };

    const getBundleIcon = (bundleName) => {
        if (bundleName.toLowerCase().includes("premium"))
            return <Crown className="h-6 w-6" />;
        if (bundleName.toLowerCase().includes("pro"))
            return <Zap className="h-6 w-6" />;
        return <Coins className="h-6 w-6" />;
    };

    const getPopularBadge = (bundle) => {
        // Mark the middle bundle as popular (or any logic you prefer)
        if (bundles.length >= 3 && bundle.id === bundles[1].id) {
            return (
                <Badge className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground z-50">
                    Most Popular
                </Badge>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout>
            <div className="flex justify-center">
                <div className="container max-w-6xl py-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full">
                            <Coins className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Buy Tokens
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Purchase tokens to participate in auctions. You can
                            use token in creating and participating auctions.
                            Choose the bundle that works best for you.
                        </p>
                    </div>

                    {/* Token Bundles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bundles.map((bundle) => {
                            const popularBadge = getPopularBadge(bundle);
                            const isPopular = !!popularBadge;

                            return (
                                <Card
                                    key={bundle.id}
                                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
                                        isPopular
                                            ? "border-primary ring-1 ring-primary"
                                            : ""
                                    }`}
                                >
                                    {popularBadge}

                                    <CardHeader className="text-center pb-4">
                                        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                                            {getBundleIcon(bundle.name)}
                                        </div>
                                        <CardTitle className="text-xl">
                                            {bundle.name}
                                        </CardTitle>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold">
                                                ${bundle.price}
                                            </span>
                                            {bundle.original_price && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    ${bundle.original_price}
                                                </span>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-6">
                                        <div className="text-center mb-4">
                                            <div className="flex items-baseline justify-center gap-2">
                                                <span className="text-4xl font-bold text-primary">
                                                    {bundle.tokens}
                                                </span>
                                                <span className="text-lg text-muted-foreground">
                                                    tokens
                                                </span>
                                            </div>
                                        </div>

                                        {bundle.features && (
                                            <ul className="space-y-2">
                                                {bundle.features.map(
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

                                        {bundle.bonus && (
                                            <Alert className="mt-4 bg-green-50 border-green-200">
                                                <Sparkles className="h-4 w-4 text-green-600" />
                                                <AlertTitle className="text-green-800">
                                                    Bonus!
                                                </AlertTitle>
                                                <AlertDescription className="text-green-700">
                                                    {bundle.bonus}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>

                                    <CardFooter>
                                        <Button
                                            onClick={() =>
                                                handleCheckout(bundle.id)
                                            }
                                            disabled={isLoading}
                                            className="w-full"
                                            size="lg"
                                            variant={
                                                isPopular
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Purchase Now
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Additional Information */}
                    <Card className="bg-muted/30 border-none">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-3">How it works</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Zap className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            1. Purchase tokens
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                            Choose a bundle that fits your needs
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Coins className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            2. Use tokens
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                            Creating and Participating auction
                                            requires tokens.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Crown className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            3. Win auctions
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                            Get the items you want
                                        </p>
                                    </div>
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
                                    Processing Your Order
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    Please wait while we prepare your checkout.
                                    This may take a few moments.
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
