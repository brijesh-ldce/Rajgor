"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    const navLinks = [
        { href: "/directory", label: "Directory" },
        { href: "/matrimony", label: "Matrimony" },
        { href: "/rojgar", label: "Rojgar" },
        { href: "/vyapar", label: "Vyapar" },
        { href: "/garv", label: "Garv (Pride)" },
    ];

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname.startsWith(link.href)
                            ? "text-primary border-b-2 border-primary pb-1"
                            : "text-muted-foreground"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
