import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase";

export const storeUrlAsDoc = async(url: string): Promise<string> => {
    const doc = await db.collection('urls').add({
        url: url,
        ttl: Timestamp.fromMillis( Date.now() + 15 * 60 * 1000 ), // 15 minutes
        });
    return doc.id
}

export const getUrlFromDoc = async(docId: string): Promise<string> => {
    const doc = await db.collection('urls').doc(docId).get();
    const data = doc.data();
    if (data == undefined) {
        return "";
    }
    return data['url'] || "";
}