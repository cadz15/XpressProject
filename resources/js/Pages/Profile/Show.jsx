import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
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
    Crown,
    Hammer,
    User,
    Lock,
    Eye,
    EyeOff,
    Calendar,
    DollarSign,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProfileShow({ user, subscription, auctions }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showTokenAlert, setShowTokenAlert] = useState(false);
    const [tokenError, setTokenError] = useState("");

    const { data, setData, put, processing, errors } = useForm({
        new_password: "",
    });

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        put(route("password.update"), {
            onSuccess: () => {
                setData("new_password", "");
            },
            onError: (error) => {
                if (error[0]?.includes("You need at least")) {
                    setTokenError(error[0].replace(".", ""));
                    setShowTokenAlert(true);
                }
            },
        });
    };

    const getSubscriptionStatusVariant = (status) => {
        switch (status) {
            case "active":
                return "success";
            case "canceled":
                return "destructive";
            case "past_due":
                return "destructive";
            default:
                return "secondary";
        }
    };

    const getAuctionStatusVariant = (status) => {
        switch (status) {
            case "live":
                return "default";
            case "ended":
                return "secondary";
            case "pending":
                return "outline";
            default:
                return "outline";
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Profile" />
            <div className="flex justify-center">
                <div className="container max-w-6xl py-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <User className="h-8 w-8" />
                                My Profile
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your account settings and activity
                            </p>
                        </div>
                    </div>

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger
                                value="overview"
                                className="flex items-center gap-2"
                            >
                                <User className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="security"
                                className="flex items-center gap-2"
                            >
                                <Lock className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger
                                value="auctions"
                                className="flex items-center gap-2"
                            >
                                <Hammer className="h-4 w-4" />
                                My Auctions
                            </TabsTrigger>
                            <TabsTrigger
                                value="billing"
                                className="flex items-center gap-2"
                            >
                                <Crown className="h-4 w-4" />
                                Billing
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User Info Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Personal Information
                                        </CardTitle>
                                        <CardDescription>
                                            Your account details and profile
                                            information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm font-medium">
                                                Name
                                            </span>
                                            <span className="text-muted-foreground">
                                                {user.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm font-medium">
                                                Email
                                            </span>
                                            <span className="text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm font-medium">
                                                Member Since
                                            </span>
                                            <span className="text-muted-foreground">
                                                {formatDate(user.created_at)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Coins className="h-5 w-5" />
                                            Account Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Coins className="h-6 w-6 text-amber-500" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Available Tokens
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {user.token_balance}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link href="/tokens">
                                                    Buy More
                                                </Link>
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Crown className="h-6 w-6 text-purple-500" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Subscription
                                                    </p>
                                                    <p className="text-lg font-bold">
                                                        {subscription
                                                            ? formatDate(
                                                                  subscription.ends_at
                                                              )
                                                            : "No Subscription"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={getSubscriptionStatusVariant(
                                                    subscription?.status
                                                )}
                                            >
                                                {subscription?.status ||
                                                    "Inactive"}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5" />
                                        Change Password
                                    </CardTitle>
                                    <CardDescription>
                                        Update your password to keep your
                                        account secure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleUpdatePassword}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="new_password">
                                                New Password
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="new_password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={data.new_password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "new_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter new password"
                                                    className="pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            {errors.new_password && (
                                                <p className="text-sm text-destructive">
                                                    {errors.new_password}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Updating..."
                                                : "Update Password"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Auctions Tab */}
                        <TabsContent value="auctions" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hammer className="h-5 w-5" />
                                        My Auctions
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your auctions and track their
                                        progress
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {auctions.length > 0 ? (
                                        <div className="space-y-4">
                                            {auctions.map((auction) => (
                                                <div
                                                    key={auction.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold">
                                                                {auction.title}
                                                            </h3>
                                                            <Badge
                                                                variant={getAuctionStatusVariant(
                                                                    auction.status
                                                                )}
                                                            >
                                                                {auction.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="h-3 w-3" />
                                                                $
                                                                {auction.current_price ||
                                                                    auction.starting_price}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(
                                                                    auction.end_time
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/auctions/${auction.id}`}
                                                        >
                                                            View Auction
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Hammer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-medium mb-2">
                                                No auctions yet
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                Start by creating your first
                                                auction
                                            </p>
                                            <Button asChild>
                                                <Link href="/auctions/create">
                                                    Create Auction
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Billing Tab */}
                        <TabsContent value="billing" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Crown className="h-5 w-5" />
                                        Subscription & Billing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {subscription ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                                <div>
                                                    <p className="font-semibold">
                                                        {subscription.plan.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Active subscription
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={getSubscriptionStatusVariant(
                                                        subscription.status
                                                    )}
                                                >
                                                    {subscription.status}
                                                </Badge>
                                            </div>
                                            <Button asChild className="w-full">
                                                <Link href="/subscriptions">
                                                    Manage Subscription
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-medium mb-2">
                                                No active subscription
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                Upgrade to access premium
                                                features
                                            </p>
                                            <Button asChild className="w-full">
                                                <Link href="/subscriptions">
                                                    View Plans
                                                </Link>
                                            </Button>
                                        </div>
                                    )}

                                    <div className="border-t pt-6">
                                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Coins className="h-6 w-6 text-amber-500" />
                                                <div>
                                                    <p className="font-semibold">
                                                        Available Tokens
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {user.token_balance}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button asChild variant="outline">
                                                <Link href="/tokens">
                                                    Buy Tokens
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Token Alert Dialog */}
                    <Dialog
                        open={showTokenAlert}
                        onOpenChange={setShowTokenAlert}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-destructive" />
                                    Insufficient Tokens
                                </DialogTitle>
                                <DialogDescription>
                                    {tokenError ||
                                        "You need tokens to perform this action."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowTokenAlert(false)}
                                >
                                    Cancel
                                </Button>
                                <Button asChild>
                                    <Link href="/tokens">Buy Tokens</Link>
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
