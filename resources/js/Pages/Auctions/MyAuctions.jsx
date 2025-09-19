import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Link, router, Head } from "@inertiajs/react";
import React from "react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import {
    Gavel,
    Crown,
    Users,
    Calendar,
    DollarSign,
    Trophy,
    MessageSquare,
    Eye,
    Image as ImageIcon,
    Clock,
    CheckCircle,
    XCircle,
    Play,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function MyAuctions() {
    const { auctions, participatedAuctions, auth } = usePage().props;
    const user = auth.user;

    const getStatusBadge = (auction) => {
        let variant, text, icon, bgColor;
        switch (auction.status) {
            case "live":
                variant = "default";
                text = "Live";
                icon = <Play className="h-3 w-3 mr-1" />;
                bgColor = "bg-blue-700 hover:bg-blue-700/50";
                break;
            case "ended":
                variant =
                    auction.winner_id === user.id ? "success" : "destructive";
                text = auction.winner_id === user.id ? "Won" : "Ended";
                icon =
                    auction.winner_id === user.id ? (
                        <Trophy className="h-3 w-3 mr-1" />
                    ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                    );
                bgColor =
                    auction.winner_id !== user.id
                        ? "bg-red-400 hover:bg-red-400/50"
                        : "bg-green-400 hover:bg-green-400/50";
                break;
            case "pending":
                variant = "secondary";
                text = "Pending";
                icon = <Clock className="h-3 w-3 mr-1" />;
                bgColor = "";
                break;
            case "completed":
                variant = "outline";
                text = "Completed";
                icon = <CheckCircle className="h-3 w-3 mr-1" />;
                bgColor = "";
                break;
            default:
                variant = "outline";
                text = auction.status;
                icon = null;
                bgColor = "";
        }
        return (
            <Badge variant={variant} className={`flex items-center ${bgColor}`}>
                {icon}
                {text}
            </Badge>
        );
    };

    const getAuctionImage = (auction) => {
        // Use the first image if available, otherwise use a placeholder
        if (auction.images && auction.images.length > 0) {
            return route("get.file", auction.images[0].id);
        }
        if (auction?.images && auction.auction.images.length > 0) {
            return route("get.file", auction.auction.images[0].id);
        }
        return null;
    };

    const getAuctionObject = (auction) => {
        // Handle both direct auction objects and participated auction objects
        return auction.auction || auction;
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Auctions" />
            <div className="container max-w-6xl py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Gavel className="h-8 w-8" />
                            My Auctions
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your auctions and track your participation
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={route("auctions.create")}>
                            <Gavel className="h-4 w-4 mr-2" />
                            Create New Auction
                        </Link>
                    </Button>
                </div>

                {/* Tabs for My Auctions vs Participated Auctions */}
                <Tabs defaultValue="my-auctions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="my-auctions"
                            className="flex items-center gap-2"
                        >
                            <Crown className="h-4 w-4" />
                            My Auctions ({auctions.total})
                        </TabsTrigger>
                        <TabsTrigger
                            value="participated"
                            className="flex items-center gap-2"
                        >
                            <Users className="h-4 w-4" />
                            Participated ({participatedAuctions.total})
                        </TabsTrigger>
                    </TabsList>

                    {/* My Auctions Tab */}
                    <TabsContent value="my-auctions">
                        {auctions.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {auctions.data.map((auction) => {
                                    const auctionObj =
                                        getAuctionObject(auction);
                                    const imageUrl =
                                        getAuctionImage(auctionObj);

                                    return (
                                        <Card
                                            key={auction.id}
                                            className="overflow-hidden group hover:shadow-lg transition-shadow"
                                        >
                                            {/* Auction Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={auctionObj.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                                    </div>
                                                )}
                                                {/* Status Badge overlay */}
                                                <div className="absolute top-3 left-3">
                                                    {getStatusBadge(auctionObj)}
                                                </div>
                                            </div>

                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <CardTitle className="text-lg line-clamp-1">
                                                        {auctionObj.title}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription className="line-clamp-2">
                                                    {auctionObj.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pb-3">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-semibold">
                                                            $
                                                            {auctionObj.current_price ||
                                                                auctionObj.starting_price}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {auctionObj.current_price
                                                                ? "Current bid"
                                                                : "Starting price"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">
                                                            {auctionObj.status ===
                                                            "scheduled"
                                                                ? "Starts: "
                                                                : "Ends: "}
                                                            {formatDate(
                                                                auctionObj.status ===
                                                                    "scheduled"
                                                                    ? auctionObj.start_time
                                                                    : auctionObj.end_time
                                                            )}
                                                        </span>
                                                    </div>
                                                    {auctionObj.participants_count >
                                                        0 && (
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">
                                                                {
                                                                    auctionObj.participants_count
                                                                }{" "}
                                                                bidder
                                                                {auctionObj.participants_count !==
                                                                1
                                                                    ? "s"
                                                                    : ""}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Additional Status Info */}
                                                    {auctionObj.status ===
                                                        "ended" &&
                                                        auctionObj.winner_id && (
                                                            <div className="flex items-center gap-2">
                                                                <Trophy className="h-4 w-4 text-amber-500" />
                                                                <span className="text-muted-foreground">
                                                                    Winner:{" "}
                                                                    {
                                                                        auctionObj
                                                                            .winner
                                                                            ?.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex flex-row gap-2">
                                                <Button
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <Link
                                                        href={route(
                                                            "auctions.show",
                                                            auctionObj.id
                                                        )}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Auction
                                                    </Link>
                                                </Button>
                                                {auction.winner_id && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "chat.show",
                                                                auction.id
                                                            )}
                                                        >
                                                            <MessageSquare className="h-4 w-4 mr-2" />
                                                            Start Chat with
                                                            Winner
                                                        </Link>
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">
                                        No auctions created yet
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start by creating your first auction to
                                        sell items on our platform.
                                    </p>
                                    <Button asChild>
                                        <Link href={route("auctions.create")}>
                                            Create Your First Auction
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pagination for My Auctions */}
                        {auctions.links.length > 3 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    {auctions.links.map((link, idx) => (
                                        <PaginationItem key={idx}>
                                            <PaginationLink
                                                href={link.url}
                                                isActive={link.active}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.visit(link.url);
                                                }}
                                            >
                                                {link.label
                                                    .replace(
                                                        "&laquo; Previous",
                                                        "←"
                                                    )
                                                    .replace(
                                                        "Next &raquo;",
                                                        "→"
                                                    )}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </TabsContent>

                    {/* Participated Auctions Tab */}
                    <TabsContent value="participated">
                        {participatedAuctions.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {participatedAuctions.data.map(
                                    (participation) => {
                                        const auction = participation.auction;
                                        const imageUrl =
                                            getAuctionImage(auction);

                                        return (
                                            <Card
                                                key={participation.id}
                                                className="overflow-hidden group hover:shadow-lg transition-shadow"
                                            >
                                                {/* Auction Image */}
                                                <div className="relative h-48 overflow-hidden">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={auction.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    {/* Status Badge overlay */}
                                                    <div className="absolute top-3 left-3">
                                                        {getStatusBadge(
                                                            auction
                                                        )}
                                                    </div>
                                                    {/* Your bid indicator */}
                                                    {participation.your_bid && (
                                                        <div className="absolute top-3 right-3">
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-blue-500 text-white"
                                                            >
                                                                Your bid: $
                                                                {
                                                                    participation.your_bid
                                                                }
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>

                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <CardTitle className="text-lg line-clamp-1">
                                                            {auction.title}
                                                        </CardTitle>
                                                    </div>
                                                    {auction.winner_id ===
                                                        user.id && (
                                                        <Badge
                                                            variant="success"
                                                            className="w-fit"
                                                        >
                                                            <Trophy className="h-3 w-3 mr-1" />
                                                            You Won!
                                                        </Badge>
                                                    )}
                                                </CardHeader>
                                                <CardContent className="pb-3">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-semibold">
                                                                $
                                                                {auction.current_price ||
                                                                    auction.starting_price}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {auction.current_price
                                                                    ? "Winning bid"
                                                                    : "Starting price"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">
                                                                Ended:{" "}
                                                                {formatDate(
                                                                    auction.end_time
                                                                )}
                                                            </span>
                                                        </div>
                                                        {participation.your_bid && (
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-blue-500" />
                                                                <span className="text-blue-600 font-medium">
                                                                    Your bid: $
                                                                    {
                                                                        participation.your_bid
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {auction.winner_id ===
                                                            user.id && (
                                                            <div className="flex items-center gap-2 text-green-600">
                                                                <Trophy className="h-4 w-4" />
                                                                <span className="font-medium">
                                                                    Congratulations!
                                                                    You won this
                                                                    auction
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex flex-row gap-2">
                                                    <Button
                                                        asChild
                                                        className="w-full"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "auctions.show",
                                                                auction.id
                                                            )}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Auction
                                                        </Link>
                                                    </Button>
                                                    {auction.winner_id ===
                                                        user.id && (
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            className="w-full"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "chat.show",
                                                                    auction.id
                                                                )}
                                                            >
                                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                                Start Chat with
                                                                Seller
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">
                                        No participated auctions
                                    </h3>
                                    <p className="text-muted-foreground">
                                        You haven't participated in any auctions
                                        yet. Start bidding to see them here!
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pagination for Participated Auctions */}
                        {participatedAuctions.links.length > 3 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    {participatedAuctions.links.map(
                                        (link, idx) => (
                                            <PaginationItem key={idx}>
                                                <PaginationLink
                                                    href={link.url}
                                                    isActive={link.active}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.visit(link.url);
                                                    }}
                                                >
                                                    {link.label
                                                        .replace(
                                                            "&laquo; Previous",
                                                            "←"
                                                        )
                                                        .replace(
                                                            "Next &raquo;",
                                                            "→"
                                                        )}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}

export default MyAuctions;
