import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import {
    Coins,
    FileClock,
    Crown,
    LogOut,
    Menu,
    PlusCircle,
    UserStar,
    User,
    Gavel,
    X,
    Settings,
} from "lucide-react";

import Logo from "@/images/logo.png";
import Footer from "@/Components/Footer";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {user ? (
                <nav className="border-b bg-background">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo and Desktop Navigation */}
                            <div className="flex items-center">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/">
                                        <img
                                            src={Logo}
                                            className="block h-16 w-auto fill-current text-foreground"
                                        />
                                    </Link>
                                </div>

                                <div className="hidden md:ml-8 md:flex md:space-x-6">
                                    <NavLink
                                        href={route("auctions.index")}
                                        active={route().current(
                                            "auctions.index"
                                        )}
                                        className="flex items-center gap-1"
                                    >
                                        <Gavel className="h-4 w-4" />
                                        Auctions
                                    </NavLink>
                                    <NavLink
                                        href={route("auctions.create")}
                                        active={route().current(
                                            "auctions.create"
                                        )}
                                        className="flex items-center gap-1"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Create Auction
                                    </NavLink>
                                    <NavLink
                                        href={route("my.auctions")}
                                        active={route().current("my.auctions")}
                                        className="flex items-center gap-1"
                                    >
                                        <UserStar className="h-4 w-4" />
                                        My Auctions
                                    </NavLink>
                                </div>
                            </div>

                            {/* Desktop User Menu */}
                            <div className="hidden md:flex md:items-center md:space-x-4">
                                {/* Token Balance */}
                                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                                    <Coins className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-medium">
                                        {user.token_balance} tokens
                                    </span>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                    >
                                        <Link href={route("tokens.index")}>
                                            Buy more
                                        </Link>
                                    </Button>
                                </div>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-8 w-8 rounded-full bg-secondary"
                                        >
                                            <div className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route("tokens.index")}
                                                className="cursor-pointer"
                                            >
                                                <Coins className="mr-2 h-4 w-4" />
                                                <span>Tokens</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route("tokens.history")}
                                                className="cursor-pointer"
                                            >
                                                <FileClock className="mr-2 h-4 w-4" />
                                                <span>Tokens History</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route(
                                                    "subscription.index"
                                                )}
                                                className="cursor-pointer"
                                            >
                                                <Crown className="mr-2 h-4 w-4" />
                                                <span>Subscription</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route(
                                                    "profiles.show",
                                                    user.id
                                                )}
                                                className="flex items-center gap-2"
                                            >
                                                <Settings className="h-4 w-4" />
                                                User Setting
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                className="cursor-pointer text-destructive focus:text-destructive"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="flex items-center md:hidden">
                                {/* Mobile Token Display */}
                                <div className="mr-4 flex items-center gap-1 rounded-lg bg-muted px-2 py-1">
                                    <Coins className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-medium">
                                        {user.token_balance}
                                    </span>
                                </div>

                                <Sheet
                                    open={mobileMenuOpen}
                                    onOpenChange={setMobileMenuOpen}
                                >
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            {mobileMenuOpen ? (
                                                <X className="h-6 w-6" />
                                            ) : (
                                                <Menu className="h-6 w-6" />
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className="w-[300px] sm:w-[400px]"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>Menu</SheetTitle>
                                        </SheetHeader>
                                        <div className="grid gap-4 py-4">
                                            {/* User Info */}
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Coins className="h-4 w-4 text-amber-500" />
                                                    {user.token_balance} tokens
                                                </div>
                                            </div>

                                            {/* Navigation Links */}
                                            <div className="space-y-2">
                                                <ResponsiveNavLink
                                                    href={route(
                                                        "auctions.index"
                                                    )}
                                                    active={route().current(
                                                        "auctions.index"
                                                    )}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Gavel className="h-4 w-4" />
                                                    Auctions
                                                </ResponsiveNavLink>
                                                <ResponsiveNavLink
                                                    href={route(
                                                        "auctions.create"
                                                    )}
                                                    active={route().current(
                                                        "auctions.create"
                                                    )}
                                                    className="flex items-center gap-2"
                                                >
                                                    <PlusCircle className="h-4 w-4" />
                                                    Create Auction
                                                </ResponsiveNavLink>

                                                <ResponsiveNavLink
                                                    href={route("my.auctions")}
                                                    active={route().current(
                                                        "my.auctions"
                                                    )}
                                                    className="flex items-center gap-2"
                                                >
                                                    <UserStar className="h-4 w-4" />
                                                    My Auctions
                                                </ResponsiveNavLink>
                                            </div>

                                            {/* Account Links */}
                                            <div className="space-y-2">
                                                <ResponsiveNavLink
                                                    href={route("tokens.index")}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Coins className="h-4 w-4" />
                                                    Tokens
                                                </ResponsiveNavLink>
                                                <ResponsiveNavLink
                                                    href={route(
                                                        "tokens.history"
                                                    )}
                                                    className="flex items-center gap-2"
                                                >
                                                    <FileClock className="mr-2 h-4 w-4" />
                                                    <span>Tokens History</span>
                                                </ResponsiveNavLink>
                                                <ResponsiveNavLink
                                                    href={route(
                                                        "subscription.index"
                                                    )}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Crown className="h-4 w-4" />
                                                    Subscription
                                                </ResponsiveNavLink>
                                                <ResponsiveNavLink
                                                    href={route(
                                                        "profiles.show",
                                                        user.id
                                                    )}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                    User Setting
                                                </ResponsiveNavLink>
                                            </div>

                                            {/* Logout */}
                                            <ResponsiveNavLink
                                                method="post"
                                                href={route("logout")}
                                                className="flex items-center gap-2 text-destructive"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Log Out
                                            </ResponsiveNavLink>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </nav>
            ) : (
                <nav className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link href="/">
                                        <img
                                            src={Logo}
                                            className="block h-16 w-auto fill-current text-foreground"
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className=" sm:ml-6 flex sm:items-center">
                                <div className="ml-3 relative">
                                    <Link href={route("login")}>
                                        <Button
                                            variant="outline"
                                            className="ml-4"
                                        >
                                            Log in
                                        </Button>
                                    </Link>
                                </div>
                                <Link
                                    href={route("register")}
                                    className="hidden sm:block"
                                >
                                    <Button className="ml-4">Sign Up</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {header && (
                <header className="bg-background shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            <Footer />
        </div>
    );
}
