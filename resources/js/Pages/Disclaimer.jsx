import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, FileText, Scale, Globe } from "lucide-react";

function Disclaimer() {
    return (
        <AuthenticatedLayout>
            <Head title="Disclaimer" />

            <div className="flex items-center justify-center">
                <div className="container max-w-4xl py-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Disclaimer
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Important legal information about using our platform
                        </p>
                    </div>

                    {/* Important Alert */}
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important Legal Notice</AlertTitle>
                        <AlertDescription>
                            Please read this disclaimer carefully before using
                            our platform. By accessing or using
                            XpressProject.com, you agree to be bound by these
                            terms.
                        </AlertDescription>
                    </Alert>

                    {/* Main Disclaimer Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Platform Disclaimer
                            </CardTitle>
                            <CardDescription>
                                Last updated:{" "}
                                {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <section className="space-y-3">
                                <p className="text-muted-foreground leading-relaxed">
                                    The information, listings, and opportunities
                                    provided on XpressProject.com (“the
                                    Website”) are for general informational
                                    purposes only, and while we strive for
                                    accuracy, XpressProject.com makes no
                                    guarantees regarding completeness or
                                    reliability. By participating in any bidding
                                    activity, users acknowledge that all bids
                                    are binding, represent a genuine intent to
                                    transact, and that XpressProject.com does
                                    not own, control, or guarantee any items or
                                    services listed unless expressly stated. The
                                    Website functions solely as a platform to
                                    connect buyers and sellers, and
                                    XpressProject.com is not a party to any
                                    transaction unless clearly specified. Users
                                    are solely responsible for conducting their
                                    own due diligence, complying with all
                                    applicable laws, and ensuring the accuracy
                                    of the information they provide.
                                    XpressProject.com shall not be liable for
                                    any losses, disputes, technical issues, or
                                    damages arising from the use of the Website
                                    or reliance on its content. Participation in
                                    bidding does not guarantee successful
                                    acquisition, sale, or favorable outcomes,
                                    and all results are subject to change
                                    without notice. By using the Website, users
                                    agree to these terms, which are governed by
                                    the laws of the United States and the State
                                    of Florida.
                                </p>
                            </section>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>Questions?</CardTitle>
                            <CardDescription>
                                Contact our legal team for clarification
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <p className="text-muted-foreground">
                                    If you have any questions about this
                                    disclaimer or our terms of service, please
                                    contact our legal department at:
                                </p>
                                <p className="font-medium">
                                    legal@xpressproject.com
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Disclaimer;
