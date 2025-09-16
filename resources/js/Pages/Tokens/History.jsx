import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import {
    Coins,
    ArrowUp,
    ArrowDown,
    Calendar,
    Plus,
    History,
} from "lucide-react";

export default function HistoryList({ ledger, balance }) {
    const getAmountColor = (amount) => {
        return amount > 0 ? "text-green-600" : "text-red-600";
    };

    const getAmountIcon = (amount) => {
        return amount > 0 ? (
            <ArrowUp className="h-4 w-4" />
        ) : (
            <ArrowDown className="h-4 w-4" />
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getReasonBadgeVariant = (reason) => {
        switch (reason) {
            case "purchase":
                return "default";
            case "bid":
                return "secondary";
            case "refund":
                return "outline";
            case "bonus":
                return "success";
            default:
                return "secondary";
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="container max-w-6xl py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Coins className="h-8 w-8" />
                            Token History
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Track your token transactions and usage
                        </p>
                    </div>

                    <Button asChild>
                        <a href={route("tokens.index")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Buy More Tokens
                        </a>
                    </Button>
                </div>

                {/* Balance Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-3">
                        <CardDescription>Current Balance</CardDescription>
                        <CardTitle className="text-4xl flex items-center gap-2">
                            <Coins className="h-8 w-8 text-amber-500" />
                            {balance} tokens
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Total tokens available for bidding
                        </p>
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Transaction History
                        </CardTitle>
                        <CardDescription>
                            All your token transactions in one place
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {ledger.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[180px]">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Date & Time
                                                </div>
                                            </TableHead>
                                            <TableHead>Transaction</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Balance After</TableHead>
                                            <TableHead>Reason</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ledger.data.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="font-medium">
                                                    {formatDate(
                                                        entry.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getAmountIcon(
                                                            entry.change
                                                        )}
                                                        <span className="capitalize">
                                                            {entry.change > 0
                                                                ? "Earn"
                                                                : "Forfeit"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    className={getAmountColor(
                                                        entry.change
                                                    )}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {entry.change > 0
                                                            ? "+"
                                                            : ""}
                                                        {entry.change}
                                                        <Coins className="h-4 w-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {entry.balance}
                                                        <Coins className="h-4 w-4 text-amber-500" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getReasonBadgeVariant(
                                                            entry.reason
                                                        )}
                                                    >
                                                        {entry.reason}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                    No transactions yet
                                </h3>
                                <p className="text-muted-foreground">
                                    Your token transactions will appear here
                                    once you start using the platform.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {ledger.links.length > 3 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    {/* Previous Page */}
                                    {ledger.links[0].url && (
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={ledger.links[0].url}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.visit(
                                                        ledger.links[0].url
                                                    );
                                                }}
                                            />
                                        </PaginationItem>
                                    )}

                                    {/* Page Numbers */}
                                    {ledger.links
                                        .slice(1, -1)
                                        .map((link, idx) => (
                                            <PaginationItem key={idx}>
                                                <PaginationLink
                                                    href={link.url}
                                                    isActive={link.active}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.visit(link.url);
                                                    }}
                                                >
                                                    {link.label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                    {/* Next Page */}
                                    {ledger.links[ledger.links.length - 1]
                                        .url && (
                                        <PaginationItem>
                                            <PaginationNext
                                                href={
                                                    ledger.links[
                                                        ledger.links.length - 1
                                                    ].url
                                                }
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.visit(
                                                        ledger.links[
                                                            ledger.links
                                                                .length - 1
                                                        ].url
                                                    );
                                                }}
                                            />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Transactions
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {ledger.total}
                                    </p>
                                </div>
                                <History className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Tokens Earned
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        +
                                        {ledger.data
                                            .filter((e) => e.change > 0)
                                            .reduce(
                                                (sum, e) => sum + e.change,
                                                0
                                            )}
                                    </p>
                                </div>
                                <ArrowUp className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Tokens Spent
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {ledger.data
                                            .filter((e) => e.change < 0)
                                            .reduce(
                                                (sum, e) => sum + e.change,
                                                0
                                            )}
                                    </p>
                                </div>
                                <ArrowDown className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
