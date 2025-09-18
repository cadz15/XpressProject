import React, { useState, useEffect } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEcho } from "@laravel/echo-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Calendar,
    AlertCircle,
    Gavel,
    Users,
} from "lucide-react";
import AuctionTimer from "@/Components/AuctionTimer";
import { formatDate } from "@/lib/utils";

export default function Show() {
    const { auction, isOwner, isParticipant, auth } = usePage().props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(auction.current_price);
    const [showParticipateDialog, setShowParticipateDialog] = useState(false);
    const [showBidAlert, setShowBidAlert] = useState(false);
    const [bidAlertMessage, setBidAlertMessage] = useState("");
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        amount: Math.round(auction.current_price) + 1,
    });

    const images = auction.images || [];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleParticipate = () => {
        setShowParticipateDialog(true);
    };

    const confirmParticipate = () => {
        post(`/auctions/${auction.id}/participate`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Participation successful");
                setShowParticipateDialog(false);
            },
            onError: (error) => {
                setShowParticipateDialog(false);
                if (error[0] === "You need at least 1 tokens.") {
                    setErrorMessage(error[0]);
                    setShowErrorDialog(true);
                } else {
                    setErrorMessage(
                        "An error occurred while trying to participate."
                    );
                    setShowErrorDialog(true);
                }
            },
        });
    };

    const handleBid = (e) => {
        e.preventDefault();

        if (parseFloat(data.amount) <= parseFloat(currentPrice)) {
            setBidAlertMessage(
                "Your bid must be higher than the current highest bid."
            );
            setShowBidAlert(true);
            return;
        }

        post(`/auctions/${auction.id}/bids`, {
            preserveScroll: true,
            onSuccess: (res) => {
                console.log("Bid successful", res);
                setCurrentPrice(data.amount);
                setData("amount", parseFloat(data.amount) + 1);
            },
            onError: (error) => {
                if (
                    error?.error ===
                    "Your bid must be higher than the current highest bid."
                ) {
                    setBidAlertMessage(error?.error);
                    setShowBidAlert(true);
                } else {
                    setErrorMessage(
                        "An error occurred while placing your bid."
                    );
                    setShowErrorDialog(true);
                }
                console.error(error);
            },
        });
    };

    const handleReloadPage = () => {
        window.location.reload();
    };

    const handleEndAuction = () => {
        console.log("End of Auction");
    };

    useEcho("chat", "MessageSent", (e) => {
        console.log(e);
    });

    useEffect(() => {
        // Echo implementation would go here
        return () => {
            // Cleanup
        };
    }, [auction.id, auth?.user?.id]);

    const statusVariant =
        {
            live: "default",
            ended: "destructive",
            scheduled: "secondary",
        }[auction.status] || "secondary";

    return (
        <AuthenticatedLayout>
            <Head title={auction.title} />
            <div className="flex justify-center">
                <div className="container max-w-6xl py-6 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {auction.title}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    variant={statusVariant}
                                    className="text-sm"
                                >
                                    {auction.status.toUpperCase()}
                                </Badge>
                                <div className="flex items-center text-muted-foreground text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Ends: {formatDate(auction.end_time)}
                                </div>
                            </div>
                        </div>

                        {auction.status === "live" && !isOwner && (
                            <div className="flex-shrink-0">
                                {isParticipant ? (
                                    <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200"
                                    >
                                        <Users className="h-3 w-3 mr-1" />
                                        Participating
                                    </Badge>
                                ) : (
                                    <Button
                                        onClick={handleParticipate}
                                        disabled={processing}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        <Gavel className="h-4 w-4 mr-2" />
                                        Join Auction
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <Card>
                                <CardContent className="p-0">
                                    {images.length > 0 ? (
                                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                                            <img
                                                src={route(
                                                    "get.file",
                                                    images[currentIndex].id
                                                )}
                                                alt={`Auction image ${
                                                    currentIndex + 1
                                                }`}
                                                className="w-full h-full object-cover"
                                            />

                                            {images.length > 1 && (
                                                <>
                                                    <Button
                                                        onClick={prevImage}
                                                        size="icon"
                                                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full"
                                                    >
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </Button>
                                                    <Button
                                                        onClick={nextImage}
                                                        size="icon"
                                                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full"
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center aspect-square bg-muted rounded-t-lg">
                                            <div className="text-muted-foreground">
                                                No images available
                                            </div>
                                        </div>
                                    )}

                                    {/* Thumbnails */}
                                    {images.length > 1 && (
                                        <div className="p-4 grid grid-cols-4 gap-2">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        setCurrentIndex(idx)
                                                    }
                                                    className={`aspect-square overflow-hidden rounded-md border-2 ${
                                                        currentIndex === idx
                                                            ? "border-primary"
                                                            : "border-transparent"
                                                    }`}
                                                >
                                                    <img
                                                        src={route(
                                                            "get.file",
                                                            img.id
                                                        )}
                                                        alt={`Thumbnail ${
                                                            idx + 1
                                                        }`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Description Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                        {auction.description ||
                                            "No description provided."}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Auction Details */}
                        <div className="space-y-6">
                            {/* Current Bid Card */}
                            <Card>
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center">
                                        <DollarSign className="h-5 w-5 mr-2" />
                                        Current Bid
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold">
                                        ${currentPrice}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Starting price: $
                                        {auction.starting_price}
                                    </div>

                                    {/* Bidding Form */}
                                    {auction.status === "live" &&
                                        isParticipant &&
                                        !isOwner && (
                                            <form
                                                onSubmit={handleBid}
                                                className="mt-6 space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="bid-amount">
                                                        Your Bid ($)
                                                    </Label>
                                                    <Input
                                                        id="bid-amount"
                                                        type="number"
                                                        value={data.amount}
                                                        onChange={(e) => {
                                                            setData(
                                                                "amount",
                                                                e.target.value
                                                            );
                                                        }}
                                                        min={currentPrice}
                                                        className="text-lg"
                                                        required
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Enter $
                                                        {Math.round(
                                                            currentPrice
                                                        ) + 1}{" "}
                                                        or more
                                                    </p>
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full"
                                                    size="lg"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                                            Placing Bid...
                                                        </>
                                                    ) : (
                                                        <>Place Bid</>
                                                    )}
                                                </Button>
                                            </form>
                                        )}

                                    {auction.status !== "live" && (
                                        <Alert
                                            variant={
                                                auction.status === "ended"
                                                    ? "destructive"
                                                    : "default"
                                            }
                                            className="mt-4"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>
                                                {auction.status === "ended"
                                                    ? "Auction has ended"
                                                    : "Auction not started yet"}
                                            </AlertTitle>
                                            <AlertDescription>
                                                {auction.status === "ended"
                                                    ? "Bidding is no longer available for this auction."
                                                    : "Bidding will begin once the auction starts."}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                            {/* Auction Timer */}
                            {auction.status !== "pending" && (
                                <AuctionTimer
                                    serverEndTime={auction.end_time}
                                />
                            )}
                            {/* Auction Details Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Auction Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Status
                                        </span>
                                        <Badge variant={statusVariant}>
                                            {auction.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Starting Price
                                        </span>
                                        <span className="font-medium">
                                            ${auction.starting_price}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Current Price
                                        </span>
                                        <span className="font-medium">
                                            ${currentPrice}
                                        </span>
                                    </div>
                                    {auction.status === "pending" && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Start Time
                                            </span>
                                            <span className="font-medium flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(auction.start_time)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            End Time
                                        </span>
                                        <span className="font-medium flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {formatDate(auction.end_time)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Category
                                        </span>
                                        <span className="font-medium">
                                            {auction.category?.name || "N/A"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Owner Actions (if applicable) */}
                            {isOwner && (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>
                                        You own this auction
                                    </AlertTitle>
                                    <AlertDescription>
                                        As the owner, you cannot place bids on
                                        your own auction.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Participation Confirmation Dialog */}
                    <AlertDialog
                        open={showParticipateDialog}
                        onOpenChange={setShowParticipateDialog}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Join Auction
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to participate in this
                                    auction? This will use one of your tokens.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={confirmParticipate}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Bid Alert Dialog */}
                    <AlertDialog
                        open={showBidAlert}
                        onOpenChange={setShowBidAlert}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Invalid Bid</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {bidAlertMessage}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleReloadPage}>
                                    OK
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Error Dialog */}
                    <AlertDialog
                        open={showErrorDialog}
                        onOpenChange={setShowErrorDialog}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Error!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {errorMessage}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction>OK</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
