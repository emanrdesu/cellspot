
import { db } from '$lib/database'
import { isLoggedIn } from '$lib/foobar';
import { error } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export const DELETE = async ({cookies, params, request}) => {

    if (await isLoggedIn(db, cookies)) {
        const body = await request.json()
        const target = body.target;

        if (target == 'phone') {
            const where = { where: { phoneID: +params.id } }
            await db.price.deleteMany(where)
            await db.spec.deleteMany(where)
            await db.image.deleteMany(where)
            await db.phone.delete({ where: { id: +params.id } })

            return new Response(null, { status: 418})
        }

        if (target == 'price') {
            const priceCount = await db.price.count({
                where: { phoneID: +params.id }
            })

            const price = await db.price.findFirst({
                where: {
                    AND: [
                        { phoneID: +params.id },
                        { amount: +body.amount },
                        { unit: body.unit }
                    ]
                }
            })

            if(price && priceCount > 1) {
                await db.price.delete({
                    where: {
                        id: price.id
                    }
                })
            }
            else {
                throw error(405, "No se puede borrar el ultimo precio")
            }
        }

        if (target == 'spec') {
            const spec = await db.spec.findFirst({
                where: {
                    AND: [
                        { phoneID: +params.id },
                        { name: body.name },
                        { value: body.value }
                    ]
                }
            })

            if(spec) {
                await db.spec.delete({
                    where: {
                        id: spec.id
                    }
                })
            }
        }

        return new Response();
    }
    else {
        throw error(401, "Prohibido")
    }
}

/** @type {import('./$types').RequestHandler} */
export const POST = async ({cookies, params, request, url}) => {
    if(await isLoggedIn(db, cookies)) {
        const urlparams = url.searchParams;

        if(Array.from(urlparams.keys()).length > 0) {
            const target = urlparams.get('target')

            if (target == 'price') {
                const price = await db.price.findFirst({
                    where: {
                        AND: [
                            { phoneID: +params.id },
                            { amount: +urlparams.get('amount') },
                            { unit: urlparams.get('unit') }
                        ]
                    }
                })

                let body = await request.json();

                if(price) {
                    await db.price.update({
                        where: { id: price?.id },
                        data: body
                    })
                }
                else {
                    await db.price.create({ data: { ...body, phoneID: +params.id } })
                }
            }

            else if(target == 'spec') {
                const spec = await db.spec.findFirst({
                    where: {
                        AND: [
                            { phoneID: +params.id },
                            { name: urlparams.get('name') },
                        ]
                    }
                })

                let body = await request.json();

                if(spec) {
                    await db.spec.update({
                        where: { id: spec.id },
                        data: body
                    })
                }
                else {
                    await db.spec.create({ data: { ...body, phoneID: +params.id } })
                }
            }
        }

        else {
            await db.phone.update({
                where: { id: +params.id },
                data: await request.json(),
            })
        }

        return new Response();
    }

    else {
        throw error(401, "Prohibido")
    }
}
