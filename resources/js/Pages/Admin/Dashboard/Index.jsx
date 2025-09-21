import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Users,
    Crown,
    Hammer,
    Gavel,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    Calendar,
    DollarSign,
    Coins,
} from "lucide-react";
import { Head, router } from "@inertiajs/react";

export default function Index({ metrics }) {
    const stats = [
        {
            title: "Total Users",
            value: metrics.total_users.users,
            icon: Users,
            trend: `${metrics.total_users.users_change}%`,
            trendDirection:
                metrics.total_users.users_change >= 0 ? "up" : "down",
            description: "From last month",
        },
        {
            title: "Active Subscriptions",
            value: metrics.active_subscriptions.active_subscriptions,
            icon: Crown,
            trend: `${metrics.active_subscriptions.subscription_change}%`,
            trendDirection:
                metrics.active_subscriptions.subscription_change >= 0
                    ? "up"
                    : "down",
            description: "Premium members",
        },
        {
            title: "Active Auctions",
            value: metrics.active_auctions.live_auctions,
            icon: Hammer,
            trend: `${metrics.active_auctions.live_change}%`,
            trendDirection:
                metrics.active_auctions.live_change >= 0 ? "up" : "down",
            description: "Live auctions",
        },
        {
            title: "Total Bids",
            value: metrics.total_bids.total_bids,
            icon: Gavel,
            trend: `${metrics.total_bids.bid_change}%`,
            trendDirection: metrics.total_bids.bid_change >= 0 ? "up" : "down",
            description: "This month",
        },
        {
            title: "Revenue",
            value: `$${metrics.total_revenue.revenue || 0}`,
            icon: DollarSign,
            trend: `${metrics.total_revenue.revenue_change}%`,
            trendDirection:
                metrics.total_revenue.revenue_change >= 0 ? "up" : "down",
            description: "Monthly revenue",
        },
        {
            title: "Conversion Rate",
            value: `${metrics.successful_auctions.conversion_rate || 0}%`,
            icon: TrendingUp,
            trend: `${metrics.successful_auctions.success_rate_change}%`,
            trendDirection:
                metrics.successful_auctions.success_rate_change >= 0
                    ? "up"
                    : "down",
            description: "Auction success rate",
        },
    ];

    const handleCreateAuction = () => {
        router.visit(route("auctions.create"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />
            <div className="container max-w-7xl py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Overview of platform performance and metrics
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            This Month
                        </Button>
                        <Button variant="outline" size="sm">
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className="h-4 w-4 text-muted-foreground">
                                        <IconComponent className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>
                                    <div className="flex items-center pt-1">
                                        <Badge
                                            variant={
                                                stat.trendDirection === "up"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            className={`text-xs ${
                                                stat.trendDirection === "up" &&
                                                "bg-green-500 hover:bg-green-500/80"
                                            }`}
                                        >
                                            {stat.trendDirection === "up" ? (
                                                <ArrowUp className="h-3 w-3 mr-1" />
                                            ) : (
                                                <ArrowDown className="h-3 w-3 mr-1" />
                                            )}
                                            {stat.trend}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground ml-2">
                                            {stat.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Tabs for Detailed Views */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="auctions">Auctions</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>
                                        Latest platform events and actions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {metrics.recent_activity?.map(
                                            (activity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                            <Users className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {
                                                                    activity.action
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {activity.user}{" "}
                                                                •{" "}
                                                                {activity.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {activity.type}
                                                    </Badge>
                                                </div>
                                            )
                                        ) || (
                                            <p className="text-muted-foreground text-center py-8">
                                                No recent activity
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Status</CardTitle>
                                    <CardDescription>
                                        Current platform health and performance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        API Services
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        All systems operational
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="success">
                                                Online
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Database
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Connected and stable
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="success">
                                                Online
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Payment Gateway
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Processing normally
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="success">
                                                Online
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage platform users and permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-center py-8">
                                    User management features coming soon...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="auctions">
                        <Card>
                            <CardHeader>
                                <CardTitle>Auction Management</CardTitle>
                                <CardDescription>
                                    Monitor and manage all auctions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-center py-8">
                                    Auction management features coming soon...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reports">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reports & Analytics</CardTitle>
                                <CardDescription>
                                    Detailed platform analytics and reports
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-center py-8">
                                    Reporting features coming soon...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Frequently used administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <Button
                                variant="outline"
                                className="flex flex-col h-16"
                            >
                                <Users className="h-4 w-4 mb-1" />
                                <span className="text-xs">Manage User</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col h-16"
                                onClick={handleCreateAuction}
                            >
                                <Hammer className="h-4 w-4 mb-1" />
                                <span className="text-xs">Create Auction</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col h-16"
                            >
                                <Coins className="h-4 w-4 mb-1" />
                                <span className="text-xs">Manage Tokens</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col h-16"
                            >
                                <Crown className="h-4 w-4 mb-1" />
                                <span className="text-xs">
                                    Manage Subscription
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col h-16"
                            >
                                <DollarSign className="h-4 w-4 mb-1" />
                                <span className="text-xs">View Revenue</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
