import { PrismaClient } from "@prisma/client"

export const db = new PrismaClient();

export async function getPhoneList(count, skip = 0, order="asc") {
    const phones = await db.phone.findMany({
        orderBy: { createdAt: order },
        take: count,
        skip: skip
    })

    for(let phone of phones) {
        const where = { where: { phoneID: phone.id } }

        const prices = await db.price.findMany(where)
        const specs = await db.spec.findMany(where)

        const images = await db.image.findMany({
            ...where, select: { filename: true }
        })

        phone.prices = prices
        phone.specs = specs
        phone.images = images.map(image => image.filename)
    }

    return phones;
}

export async function getLastPhoneID() {
    const lastPhone = await db.phone.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    return lastPhone?.id || 0;
}
