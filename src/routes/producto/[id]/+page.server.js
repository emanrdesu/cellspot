
import {db} from '$lib/database'
import { isLoggedIn } from '$lib/foobar';

export async function load({cookies, params}) {
    const id = +params.id
    const phone = await db.phone.findFirst({ where: { id: id } });

    await db.phone.update({
        where: { id: id },
        data: { views: phone.views + 1 }
    })

    const prices = await db.price.findMany({
         where: { phoneID: id },
         orderBy: { id: "asc" }
    })

    const specs = await db.spec.findMany({
        where: { phoneID: id },
        orderBy: { name: "asc"}
    })

    const images = await db.image.findMany({
        where: { phoneID: id },
        select: { filename: true }
    })

    phone.prices = prices
    phone.specs = specs
    phone.images = images.map(image => image.filename)

    return {
        phone: phone,
        loggedIn: await isLoggedIn(db, cookies),
        randomUUID: crypto.randomUUID()
    }
}
