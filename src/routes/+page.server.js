
import {getPhoneList} from "$lib/database.js";

export const load = async () => {
    const phones = await getPhoneList(3, 0, "desc");
    return { phones: phones }
}