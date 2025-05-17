"use client";
import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarBrand,
    NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Image } from "@heroui/image";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { UserContext } from "@/context/user-context";
import { use, useContext } from "react";
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";
export const Navbar = () => {
    const { userToken, userEmail, role } = useContext(UserContext);
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };
    return (
        <HeroUINavbar maxWidth="2xl" position="sticky">
            {/* Left section with logo */}
            <NavbarContent className="basis-1/5 sm:basis-1/4" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink
                        className="flex justify-start items-center gap-1"
                        href="/"
                    >
                        <p className="font-bold text-inherit">Workshoply</p>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            {/* Middle section with navigation links */}
            <NavbarContent
                className="hidden lg:flex basis-1/2"
                justify="center"
            >
                <ul className="flex gap-12 justify-center items-center">
                    <NavbarItem>
                        <NextLink
                            className={clsx(
                                linkStyles({ color: "foreground" }),
                                "data-[active=true]:text-primary data-[active=true]:font-medium"
                            )}
                            color="foreground"
                            href="/"
                        >
                            Home
                        </NextLink>
                    </NavbarItem>
                    {role === "admin" && (
                        <NavbarItem>
                            <NextLink
                                className={clsx(
                                    linkStyles({ color: "foreground" }),
                                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                                )}
                                color="foreground"
                                href="/admin-panel"
                            >
                                Dashboard
                            </NextLink>
                        </NavbarItem>
                    )}
                </ul>
            </NavbarContent>

            {/* Right section with theme toggle and user profile */}
            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-1/4"
                justify="end"
            >
                <NavbarItem className="hidden sm:flex gap-2">
                    <ThemeSwitch />
                    {userToken ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="primary"
                                    classNames={{
                                        base: "bg-violet-800",
                                    }}
                                    size="sm"
                                />
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Profile Actions"
                                variant="flat"
                            >
                                <DropdownItem
                                    key="profile"
                                    className="h-14 gap-2"
                                >
                                    <p className="font-semibold">
                                        Signed in as
                                    </p>
                                    <p className="font-semibold">{userEmail}</p>
                                </DropdownItem>
                                <DropdownItem
                                    key="my-bookings"
                                    onPress={() => router.push("/user-booking")}
                                >
                                    <p>My Bookings</p>
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    color="danger"
                                    onPress={handleLogout}
                                >
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-violet-800 text-white">
                                Login
                            </Button>
                        </Link>
                    )}
                </NavbarItem>
            </NavbarContent>
        </HeroUINavbar>
    );
};
