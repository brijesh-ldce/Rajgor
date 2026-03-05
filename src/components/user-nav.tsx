"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export function UserNav({ user }: { user: any }) {
    return (
        <div className="flex items-center gap-4">
            {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                <Link href="/admin" className="text-sm font-medium text-red-600 hover:text-red-700">
                    Admin Panel
                </Link>
            ) : null}

            <div className="relative group">
                <button className="flex items-center text-sm font-medium focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-orange-100 text-primary flex items-center justify-center font-bold">
                        {user.name?.charAt(0) || "U"}
                    </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                        <div className="px-4 py-2 border-b border-border">
                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                            Dashboard
                        </Link>
                        <Link href="/matrimony/my-biodata" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                            My Biodata
                        </Link>
                        <Link href="/vyapar/list" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                            List Business
                        </Link>
                        <Link href="/garv/my-profile" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                            My Profile & Badges
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
