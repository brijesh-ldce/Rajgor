import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { getLocale } from "next-intl/server";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const locale = await getLocale();

    if (!session || !session.user) {
        redirect({ href: "/login", locale });
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session!.user!.id },
        select: { isApproved: true }
    });

    if (!dbUser?.isApproved) {
        redirect({ href: "/pending-approval", locale });
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="container flex h-16 items-center px-4 md:px-6">
                    <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                        <span className="font-heading font-bold text-primary sm:inline-block">
                            Rajgor Samaj
                        </span>
                    </Link>
                    <MainNav className="hidden md:flex flex-1" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav user={session!.user} />
                    </div>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
