
import { db } from "$lib/database";
import { isLoggedIn } from "$lib/foobar";

export const load = async ({cookies}) => {
    return {
        faq: await db.QA.findMany(),
        loggedIn: await isLoggedIn(db, cookies)
    }
}
