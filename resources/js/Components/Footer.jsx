import { Link } from "@inertiajs/react";
import React from "react";
import Logo from "@/images/logo.png";

// Footer Component
function Footer() {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex-shrink-0 flex items-center bg-white w-fit rounded-full">
                            <Link href="/">
                                <img
                                    src={Logo}
                                    className="block h-20 w-auto fill-current text-foreground"
                                />
                            </Link>
                        </div>
                        <span className="text-white font-bold">
                            XpressProject
                        </span>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-4 ">
                            <li>
                                <Link
                                    href={route("privacy")}
                                    className="text-base text-gray-300 hover:text-white"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("terms")}
                                    className="text-base text-gray-300 hover:text-white"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={route("disclaimer")}
                                    className="text-base text-gray-300 hover:text-white"
                                >
                                    Disclaimer
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                    {/* <div className="flex space-x-6 md:order-2">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <Youtube className="h-6 w-6" />
                        </a>
                    </div> */}
                    <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                        &copy; 2025 XpressProject. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
