import { isLoggedIn } from "$lib/foobar"
import { db } from '$lib/database'
import { error } from "@sveltejs/kit"

export const POST = async ({request, cookies, url}) => {
    const id = url.searchParams.get('id')
    const body = await request.json()

    if(await isLoggedIn(db, cookies)) {
        // create
        if(id == '') {
            await db.QA.create({
                data: body
            })
        }
        else {
            await db.QA.update({
                where: { id: +id },
                data: body
            })
        }

        return new Response(null, { status: 201 })
    }

    throw error(401, "Prohibido")
}

export const DELETE = async ({cookies, url}) => {
    const id = url.searchParams.get('id')

    if(await isLoggedIn(db, cookies)) {
        await db.QA.delete({
            where: { id: +id }
        })

        return new Response(null, { status: 204 })
    }

    throw error(401, "Prohibido")
}
