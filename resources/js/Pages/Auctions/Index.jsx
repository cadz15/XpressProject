import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Search,
    Clock,
    DollarSign,
    Eye,
    Grid3X3,
    List,
    Gavel,
    Users,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { formatDate } from "@/lib/utils";

export default function Index() {
    const { auctions, filters, categories } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "all");
    const [category, setCategory] = useState(filters?.category || "all");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

    console.log(auctions);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("auctions.index"),
            {
                search: search || undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
                category: category || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        router.get(
            route("auctions.index"),
            {
                search: search || undefined,
                status: value !== "all" ? value : undefined,
                category: category || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        router.get(
            route("auctions.index"),
            {
                search: search || undefined,
                status: statusFilter || undefined,
                category: value !== "all" ? value : undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "live":
                return "default";
            case "ended":
                return "destructive";
            case "scheduled":
                return "secondary";
            default:
                return "outline";
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex justify-center">
                <div className="container py-6 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Auctions
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Browse all available auctions
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tabs
                                value={viewMode}
                                onValueChange={setViewMode}
                                className="w-auto"
                            >
                                <TabsList>
                                    <TabsTrigger
                                        value="grid"
                                        className="h-9 w-9 p-0"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="list"
                                        className="h-9 w-9 p-0"
                                    >
                                        <List className="h-4 w-4" />
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col md:flex-row gap-4"
                            >
                                <div className="flex-1 relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search auctions..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-8"
                                    />
                                </div>

                                <div className="w-full md:w-[180px]">
                                    <Select
                                        value={category}
                                        onValueChange={handleCategoryChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Categories
                                            </SelectItem>
                                            {categories.map(
                                                (categoryItem, index) => (
                                                    <SelectItem
                                                        value={
                                                            categoryItem.name
                                                        }
                                                        key={index}
                                                    >
                                                        {categoryItem.name.toUpperCase()}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full md:w-[180px]">
                                    <Select
                                        value={statusFilter}
                                        onValueChange={handleStatusChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Statuses
                                            </SelectItem>
                                            <SelectItem value="live">
                                                Live
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="ended">
                                                Ended
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    type="submit"
                                    className="whitespace-nowrap"
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Auction list */}
                    {auctions.data.length > 0 ? (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    : "space-y-4"
                            }
                        >
                            {auctions.data.map((auction) => (
                                <Card
                                    key={auction.id}
                                    className={
                                        viewMode === "list"
                                            ? "flex flex-col md:flex-row"
                                            : ""
                                    }
                                >
                                    {viewMode === "list" &&
                                        auction.images?.[0] && (
                                            <div className="md:w-1/3">
                                                <img
                                                    src={route(
                                                        "get.file",
                                                        auction.images[0].id
                                                    )}
                                                    alt={auction.title}
                                                    className="h-full w-full object-cover rounded-l-lg"
                                                />
                                            </div>
                                        )}
                                    <div
                                        className={
                                            viewMode === "list" ? "w-full" : ""
                                        }
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <CardTitle className="text-lg line-clamp-1">
                                                    {auction.title}
                                                </CardTitle>
                                                <Badge
                                                    variant={getStatusBadgeVariant(
                                                        auction.status
                                                    )}
                                                >
                                                    {auction.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-3">
                                            {viewMode === "grid" &&
                                                auction.images?.[0] && (
                                                    <div className="mb-4 rounded-lg overflow-hidden">
                                                        <img
                                                            src={route(
                                                                "get.file",
                                                                auction
                                                                    .images[0]
                                                                    .id
                                                            )}
                                                            alt={auction.title}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    </div>
                                                )}
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm">
                                                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                                    <span className="font-semibold">
                                                        $
                                                        {auction.current_price ||
                                                            auction.starting_price}
                                                    </span>
                                                    <span className="text-muted-foreground ml-1">
                                                        {auction.current_price
                                                            ? "Current bid"
                                                            : "Starting price"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        {auction.status ===
                                                        "scheduled"
                                                            ? "Starts: "
                                                            : "Ends: "}
                                                        {formatDate(
                                                            auction.status ===
                                                                "scheduled"
                                                                ? auction.start_time
                                                                : auction.end_time
                                                        )}
                                                    </span>
                                                </div>
                                                {auction.participants_count >
                                                    0 && (
                                                    <div className="text-sm text-muted-foreground flex">
                                                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                                        {
                                                            auction.participants_count
                                                        }{" "}
                                                        bidder
                                                        {auction.participants_count !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button asChild className="w-full">
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
                                        </CardFooter>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground mb-4">
                                No auctions found matching your criteria.
                            </div>
                            <Button asChild variant="outline">
                                <Link href={route("auctions.index")}>
                                    Clear filters
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {auctions.meta && auctions.meta.last_page > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            {auctions.meta.links.map((link, index) => (
                                <Button
                                    key={index}
                                    asChild
                                    variant={
                                        link.active ? "default" : "outline"
                                    }
                                    size="icon"
                                    disabled={!link.url}
                                >
                                    <Link
                                        href={link.url || "#"}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
