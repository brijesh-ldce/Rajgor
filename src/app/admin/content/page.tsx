import { prisma } from "@/lib/prisma";
import AdminContentClient from "./client-page";

export default async function AdminContentPage() {
    const [pendingBiodatas, pendingBusinesses, pendingJobs] = await Promise.all([
        prisma.biodata.findMany({
            where: { isApproved: false },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.business.findMany({
            where: { isApproved: false },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.jobPosting.findMany({
            where: { isApproved: false },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return <AdminContentClient initialData={{
        biodatas: pendingBiodatas,
        businesses: pendingBusinesses,
        jobs: pendingJobs
    }} />;
}
