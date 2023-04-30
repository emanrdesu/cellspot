
import {db, getPhoneList} from "$lib/database.js";

export async function load({url}) {
    const page = url.searchParams.get('page') || 1
    const skip = (page - 1) * 9;
    const phones = await getPhoneList(9, skip, "desc");
    const count = await db.phone.count();

    return {
        phones: phones,
        pageNumber: +page,
        count: count,
        lastPage: (phones.length < 9) || ((phones.length + skip) >= count),
    }
}
