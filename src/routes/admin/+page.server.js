import { db, getLastPhoneID } from "$lib/database";
import { isLoggedIn, sha256 } from "$lib/foobar";

export const load = async function ({ cookies }) {
    return {
        loggedIn: await isLoggedIn(db, cookies)
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({ cookies, request}) => {
        const form = await request.formData()
        const password = form.get("password");

        const actualPassword = await db.password.findFirst();
        if (actualPassword.password == password) {
            cookies.set("password", sha256(password))
            return {
                success: true
            }
        }

        return {
            success: false
        }
    },

    salir: async ({cookies}) => {
        cookies.delete("password")
    },

    add: async ({fetch, cookies, request}) => {
        const formData = await request.formData()
        const failure = { exito: false }

        // id
        const id = (await getLastPhoneID()) + 1

        // brand + name
        let [brand, ...name] = formData.get('brand+name').split(" ")

        if(name.length == 0) {
            return failure
        } else {
            name = name.join(" ")
        }

        // prices
        const prices = []

        for(let i = 0; i < 3; i++) {
            const amount = formData.get(`price-${i}`)

            if(amount != '')
                prices.push({
                    amount: +amount,
                    unit: formData.get(`price-${i}-unit`)
                })
        }

        // specs
        const specs = []

        for(let i = 0; i < formData.get('spec-count'); i++) {
            if(formData.has(`spec-${i}-key`))
                specs.push({
                    name: formData.get(`spec-${i}-key`),
                    value: formData.get(`spec-${i}-value`)
                })
        }

        const photos = formData.getAll("photos").map(p => {
            return {
                file: p,
                name: crypto.randomUUID(),
                ext: p.name.split('.').splice(-1),
            }
        })

        if(await isLoggedIn(db, cookies)) {
            // create phone in database
            await db.phone.create({
                data: {
                    id: id,
                    name: name,
                    brand: brand,
                    description: formData.get("description") || '',
                    condition: formData.get("condition"),
                    price: {
                        create: prices
                    },

                    // images: photos.map(e => e.name + '.' + e.ext),
                    specs: {
                        create: specs,
                    }
                }
            })

            // upload photos
            for (let p of photos)
                await fetch(`/photo/${id}/${p.name}.${p.ext}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Cookie': `password=${cookies.get("password")}`,
                        'Content-Type': p.file.type,
                    },
                    body: new Uint8Array(await p.file.arrayBuffer()),
                })

            return {
                exito: true
            }
        }

        return failure
    }
  };
