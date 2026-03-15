const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@rajgorsamaj.live';
    const adminPassword = 'Rajgor@#$2026';

    console.log(`Starting to seed...`);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
        console.log(`Admin user ${adminEmail} already exists. Ensuring they have ADMIN role, are approved, and have the updated password.`);
        await prisma.user.update({
            where: { email: adminEmail },
            data: {
                role: 'ADMIN',
                isApproved: true,
                password: hashedPassword
            },
        });
        console.log(`✅ Admin user updated.`);
        return;
    }


    // Create admin user
    const admin = await prisma.user.create({
        data: {
            name: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            phone: '9999999999',
            city: 'Ahmedabad',
            state: 'Gujarat',
            role: 'ADMIN',
            isVerified: true,
            isApproved: true,
        },
    });

    console.log(`✅ Admin user created successfully:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
