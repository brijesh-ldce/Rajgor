import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BusinessDetailPageClient from "./client-page";

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const business = await prisma.business.findUnique({
        where: { id },
        include: {
            user: {
                select: { name: true }
            },
            helpNeeded: {
                include: {
                    helpOffers: {
                        include: {
                            user: { select: { name: true } }
                        },
                        orderBy: { likes: 'desc' }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!business || (!business.isApproved && session.user.role !== "ADMIN" && business.userId !== session.user.id)) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Business not found or pending approval.</h1>
            </div>
        );
    }

    // Increment views
    if (business.userId !== session.user.id) {
        await prisma.business.update({
            where: { id: business.id },
            data: { views: { increment: 1 } }
        });
    }

    return <BusinessDetailPageClient business={business} sessionUser={session.user} />;
}
