import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { Clock, AlertCircle, CheckCircle2, Zap } from "lucide-react";

const AuctionTimer = ({ serverEndTime, onEndTime }) => {
    const [endTime, setEndTime] = useState(null); // Auction end time in UTC
    const [timeLeft, setTimeLeft] = useState(0); // Time remaining in milliseconds

    useEffect(() => {
        // Fetch the auction end time from the server on mount
        setEndTime(new Date(serverEndTime).getTime());
    }, [serverEndTime]);

    useEffect(() => {
        if (endTime) {
            const interval = setInterval(() => {
                const remainingTime = endTime - Date.now(); // Difference from current UTC time
                if (remainingTime <= 0) {
                    clearInterval(interval);
                    setTimeLeft(0); // Stop the timer when auction ends
                    onEndTime();
                } else {
                    setTimeLeft(remainingTime);
                }
            }, 1000); // Update every second

            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, [endTime]);

    const formatTime = (ms) => {
        const totalSeconds = Math.max(ms / 1000, 0);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const getTimeVariant = (ms) => {
        if (ms <= 0) return "ended";
        if (ms <= 3600000) return "ending-soon"; // 1 hour
        if (ms <= 86400000) return "ending-today"; // 24 hours
        return "normal";
    };

    const timeVariant = getTimeVariant(timeLeft);

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5" />
                        Auction Ends In
                    </CardTitle>
                    <Badge
                        variant={
                            timeVariant === "ended"
                                ? "destructive"
                                : timeVariant === "ending-soon"
                                ? "destructive"
                                : timeVariant === "ending-today"
                                ? "default"
                                : "secondary"
                        }
                        className="animate-pulse"
                    >
                        {timeVariant === "ended"
                            ? "Ended"
                            : timeVariant === "ending-soon"
                            ? "Ending Soon!"
                            : timeVariant === "ending-today"
                            ? "Today"
                            : "Active"}
                    </Badge>
                </div>
                <CardDescription>
                    {timeLeft > 0
                        ? "Time remaining until auction closes"
                        : "This auction has ended"}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {timeLeft > 0 ? (
                    <div className="space-y-4">
                        <div
                            className={`text-3xl font-bold font-mono text-center ${
                                timeVariant === "ending-soon"
                                    ? "text-destructive animate-pulse"
                                    : timeVariant === "ending-today"
                                    ? "text-amber-600"
                                    : "text-foreground"
                            }`}
                        >
                            {formatTime(timeLeft)}
                        </div>

                        {timeVariant === "ending-soon" && (
                            <Alert
                                variant="destructive"
                                className="animate-pulse"
                            >
                                <Zap className="h-4 w-4" />
                                <AlertTitle>Hurry!</AlertTitle>
                                <AlertDescription>
                                    This auction is ending soon. Place your
                                    final bids!
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-xs text-center text-muted-foreground">
                            <div>Hours</div>
                            <div>Minutes</div>
                            <div>Seconds</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-3">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                        <p className="text-lg font-semibold">Auction Ended</p>
                        <p className="text-sm text-muted-foreground">
                            The auction has concluded. Thank you for
                            participating!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AuctionTimer;
