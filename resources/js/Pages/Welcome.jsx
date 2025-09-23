import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import Logo from "@/images/logo.png";
import JewelryImage from "@/images/jewelry.jpg";
import ArtImage from "@/images/arts.webp";
import AntiqueImage from "@/images/antiques.jpg";
import WatchImage from "@/images/watches.jpeg";
import HeroImage from "@/images/hero.png";
import Footer from "@/Components/Footer";

// Mock data
const featuredAuctions = [
    {
        id: 1,
        title: "Vintage Diamond Necklace",
        image: "http://static.photos/jewelry/640x360/1",
        currentBid: 3250,
        bids: 14,
        timeLeft: "1d 4h",
        progress: 60,
        badge: { text: "HOT", color: "bg-red-500" },
    },
    {
        id: 2,
        title: "Rolex Submariner 2022",
        image: "http://static.photos/watches/640x360/1",
        currentBid: 15750,
        bids: 8,
        timeLeft: "3d 12h",
        progress: 30,
        badge: { text: "NEW", color: "bg-yellow-500" },
    },
    {
        id: 3,
        title: "Modern Abstract Painting",
        image: "http://static.photos/art/640x360/2",
        currentBid: 2100,
        bids: 5,
        timeLeft: "12h 30m",
        progress: 85,
        badge: null,
    },
];

const categories = [
    { id: 1, name: "Art", image: ArtImage },
    { id: 2, name: "Jewelry", image: JewelryImage },
    { id: 3, name: "Watches", image: WatchImage },
    {
        id: 4,
        name: "Antiques",
        image: AntiqueImage,
    },
];

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        image: "http://static.photos/people/200x200/2",
        text: "I've found incredible pieces for my collection through XpressProject. The authentication process gives me confidence in every purchase.",
    },
    {
        id: 2,
        name: "Michael Chen",
        image: "http://static.photos/people/200x200/3",
        text: "As a seller, I appreciate how XpressProject handles everything professionally. My items consistently sell for premium prices.",
    },
    {
        id: 3,
        name: "Emma Rodriguez",
        image: "http://static.photos/people/200x200/4",
        text: "The mobile bidding experience is seamless. I can participate in auctions anywhere, and the notifications keep me updated.",
    },
];

// Navbar Component
function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
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
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="ml-3 relative">
                            <Link href={route("login")}>
                                <Button variant="outline" className="ml-4">
                                    Log in
                                </Button>
                            </Link>
                        </div>
                        <Link href={route("register")}>
                            <Button className="ml-4">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Hero Section Component
function HeroSection() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 45,
        seconds: 12,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                seconds--;

                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                    if (minutes < 0) {
                        minutes = 59;
                        hours--;
                    }
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div
            id="vanta-bg"
            className="hero-gradient py-20 px-4 sm:px-6 lg:px-8 "
        >
            <div className="max-w-7xl mx-auto">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 py-12">
                    <div className="px-4 sm:px-0 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                        <div data-aos="fade-right">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl pb-6">
                                <span className="block">
                                    Discover rare finds
                                </span>
                                <span className="block text-indigo-600">
                                    Bid & win treasures
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 pb-8">
                                Join thousands of collectors and enthusiasts in
                                our exclusive auctions. From art to antiques,
                                find what speaks to you.
                            </p>
                            <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                                <Link href={route("login")}>
                                    <Button className="px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10">
                                        Explore Auctions
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-12 relative h-full sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
                        data-aos="fade-left"
                    >
                        <img src={HeroImage}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Featured Auctions Component
function FeaturedAuctions() {
    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2
                        className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                        data-aos="fade-up"
                    >
                        Featured Auctions
                    </h2>
                    <p
                        className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        Handpicked items from our most exclusive collections
                    </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredAuctions.map((auction, index) => (
                        <Card
                            key={auction.id}
                            className="overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
                            data-aos="fade-up"
                            data-aos-delay={200 + index * 100}
                        >
                            <CardContent className="p-0">
                                <div className="relative">
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={auction.image}
                                        alt={auction.title}
                                    />
                                    {auction.badge && (
                                        <Badge
                                            className={`absolute top-2 right-2 ${auction.badge.color} text-white`}
                                        >
                                            {auction.badge.text}
                                        </Badge>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {auction.title}
                                    </h3>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-gray-500">
                                            Current bid
                                        </span>
                                        <span className="font-bold text-indigo-600">
                                            $
                                            {auction.currentBid.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-gray-500">
                                            Bids
                                        </span>
                                        <span className="font-medium">
                                            {auction.bids}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>Ends in</span>
                                            <span className="font-medium">
                                                {auction.timeLeft}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div
                                                className="bg-indigo-600 h-1.5 rounded-full"
                                                style={{
                                                    width: `${auction.progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <Button className="mt-4 w-full">
                                        Place Bid
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Button>
                        View All Auctions
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Categories Section Component
function CategoriesSection() {
    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2
                        className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                        data-aos="fade-up"
                    >
                        Browse Categories
                    </h2>
                    <p
                        className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        Find what you love in our specialized collections
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="relative rounded-lg overflow-hidden shadow-md h-48 cursor-pointer group"
                            data-aos="fade-up"
                            data-aos-delay={200 + index * 100}
                        >
                            <img
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                src={category.image}
                                alt={category.name}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
                                <h3 className="text-white text-xl font-bold">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// How It Works Component
function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: "Register & Verify",
            description:
                "Create your account and complete identity verification to start bidding.",
        },
        {
            number: 2,
            title: "Browse & Bid",
            description:
                "Explore thousands of items and place your bids on what you love.",
        },
        {
            number: 3,
            title: "Win & Collect",
            description:
                "If you win, complete payment and arrange collection or delivery of your item.",
        },
    ];

    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2
                        className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                        data-aos="fade-up"
                    >
                        How XpressProject Works
                    </h2>
                    <p
                        className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        Simple steps to start bidding and selling
                    </p>
                </div>

                <div className="mt-10">
                    <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className="relative"
                                data-aos="fade-up"
                                data-aos-delay={200 + index * 100}
                            >
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <span className="text-xl font-bold">
                                        {step.number}
                                    </span>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Testimonials Component
function Testimonials() {
    return (
        <div className="py-12 bg-indigo-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2
                        className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                        data-aos="fade-up"
                    >
                        Trusted by Collectors Worldwide
                    </h2>
                    <p
                        className="mt-4 max-w-2xl text-xl text-indigo-200 lg:mx-auto"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        What our community says about XpressProject
                    </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={testimonial.id}
                            className="p-6"
                            data-aos="fade-up"
                            data-aos-delay={200 + index * 100}
                        >
                            <CardContent className="p-0">
                                <div className="flex items-center">
                                    <img
                                        className="h-12 w-12 rounded-full"
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                    />
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">
                                            {testimonial.name}
                                        </h4>
                                        <div className="flex mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="text-yellow-400 h-4 w-4 fill-current"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600">
                                    {testimonial.text}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// CTA Section Component
function CTASection() {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2
                    className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                    data-aos="fade-right"
                >
                    <span className="block">Ready to dive in?</span>
                    <span className="block text-indigo-600">
                        Start bidding or selling today.
                    </span>
                </h2>
                <div
                    className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
                    data-aos="fade-left"
                >
                    <Button className="px-5 py-3 text-base font-medium">
                        Join Now
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Main App Component
export default function BidHiveApp() {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = React.useRef(null);

    useEffect(() => {
        // Initialize AOS
    }, [vantaEffect]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Head title="Welcome" />
            <style global>{`
                .hero-gradient {
                    background: linear-gradient(
                        135deg,
                        #f5f7fa 0%,
                        #c3cfe2 100%
                    );
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                        0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                .countdown-timer {
                    font-family: monospace;
                }
            `}</style>

            <Navbar />
            <div>
                <HeroSection />
            </div>
            <CategoriesSection />
            <HowItWorks />
            <Testimonials />
            <CTASection />
            <Footer />
        </div>
    );
}
