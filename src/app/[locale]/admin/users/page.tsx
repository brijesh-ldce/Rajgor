import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./client-page";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        where: { role: "MEMBER" },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            aadharUrl: true,
            isApproved: true,
            createdAt: true
        }
    });

    return <AdminUsersClient initialUsers={users} />;
}
