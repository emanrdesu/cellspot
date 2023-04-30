import { error, json } from '@sveltejs/kit';
import { db } from '$lib/database'
import { isLoggedIn } from '$lib/foobar';

/** @type {import('./$types').RequestHandler} */
export const GET = async({params, setHeaders}) => {
    const { phoneID, fileName } =  params;
    const extension = fileName.split('.').splice(-1)

    try {
        const image = await db.image.findFirst({
            where: {
                phoneID: +phoneID,
                filename: fileName
            }
        })

        setHeaders({
            'content-type': `image/${extension}`
        })

        return new Response(image?.bytes);
    }

    catch {
        throw error(404, "Image does not exist.")
    }
}

/** @type {import('./$types').RequestHandler} */
export const POST = async({cookies, params, request}) => {
    if(await isLoggedIn(db, cookies)) {
        const {phoneID, fileName} = params

        if(request.body) {
            await db.image.create({
                data: {
                    phoneID: +phoneID,
                    filename: fileName,
                    bytes: Buffer.from(await request.arrayBuffer())
                }
            })
        }

        return json({
            message: "Posteado"
        })
    }

    else {
        throw error(401, "Prohibido")
    }
}

/** @type {import('./$types').RequestHandler} */
export const DELETE = async({cookies, params}) => {
    if (await isLoggedIn(db, cookies)) {
        const {fileName} = params

        await db.image.deleteMany({
            where: { filename: fileName }
        })

        return new Response()
    }
    else {
        throw error(401, "Prohibido")
    }
}
