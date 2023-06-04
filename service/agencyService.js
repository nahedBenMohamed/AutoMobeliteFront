import prisma from "@/lib/prisma";

export async function addAgency(name, email, tel, location) {
    const agency = await prisma.agency.create({
        data: {
            name,
            email,
            tel,
            location,
        },
    });

    return agency;
}
