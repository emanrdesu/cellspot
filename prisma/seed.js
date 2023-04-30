
import { PrismaClient } from "@prisma/client";
import fs from 'fs/promises'

const prisma = new PrismaClient();

async function main() {
    for (const table of ['image', 'price', 'spec', 'QA', 'phone'])
        await prisma[table].deleteMany();

    const FAQ = [
        {
            question: "Cuanto se demora en venir mi mobil?",
            answer: `Depende de cuando llegue la mula desde E.U.U.<br>
La mula viene una ves al mes asta la Isla de la Juventud.<br>
Apenas llegue y el telefono sea entregado, nosotros los contactaremos para que lo vayas a buscar.`
        },

        {
            question: "Si mando a buscar un mobil, porque tengo que pagar antes de recibir?",
            answer: `Porque eso nos asegura que lo que compramos va a ser vendido.<br>
Si mandamos a buscar un telefono y no se vende, perdemos nuestro tiempo.<br>
Usted va a recibir su telefono asegurado.<br>
Si no llega el telefono, su dinero va ser returnado.`
        },

        {
            question: "Mi mobil va a llegar con cargador/mica/protector?",
            answer: `Depende de como sea recibido de quien lo compramos.<br>
En mayoria de los casos, mica or protector no vienen junto al mobil.<br>
Los cargadores pueden ser que lleguen junto al mobil, pero en mayoria van a venir solo con cable.`
        }
    ]

    for(let qa of FAQ)
        await prisma.QA.create({ data: qa })

    await prisma.phone.create({
        data: {
            id: 1,
            name: "Pixel 6a",
            brand: "Google",
            condition: "NUEVO",
            views: 319,
            price: {
                create:  [
                    { amount: 350, unit: "MLC" },
                    { amount: 350, unit: "USD" }
                ]
            },

            specs: {
                create: [
                    { name: "Pantalla", value: "6.1in | Full"},
                    { name: "Antutu v9", value: "705123"},
                    { name: "Google Tensor" },
                    { name: "RAM", value: "6GB" },
                    { name: "Camara", value: "12 Mpx | f/1.9"},
                    { name:  "Almanecimiento", value: "128GB" },
                    { name: "Bateria", value: "4410 mAh | Carga rápida 18W" }
                ]
            }
        }
    })


    for(let i = 1; i <= 3; i++) {
        const image = `./prisma/seed/${i}.jpg`

        await prisma.image.create({
            data: {
                phoneID: 1,
                filename: crypto.randomUUID() + '.jpg',
                bytes: await fs.readFile(image)
            }
        })
    }
}

await main()
