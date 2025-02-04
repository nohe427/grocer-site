import {Storage, GetSignedUrlConfig} from '@google-cloud/storage';
import {v4} from 'uuid';
import {} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const project = 'lon-next';
const storage = new Storage({projectId: project});
const bucket = 'lon-next.firebasestorage.app';
const db = getFirestore();


export interface UploadUrls {
    uploadLocation: string,
    downloadLocation: string,
}

export const GenerateUploadUrls = async (mime: string, host:string): Promise<UploadUrls> => {
    const id = v4();
    const outputName = `tripediaPhotos/${id.toString()}`;
    const mimeType = mime;
    const putUrl = await generateV4PutObjectSignedUrl(bucket, outputName, mimeType)
    const getUrl = await generateV4GetObjectSignedUrl(bucket, outputName);
    const docId = await storeUrlAsDoc(getUrl);
    return {
        uploadLocation: putUrl,
        downloadLocation: `https://${host}/l/${docId}`,
    };
}

const generateV4PutObjectSignedUrl = 
    async (
        bucket: string, object: string, mimeType: string): Promise<string> => {
    if (mimeType == "") {
        mimeType = "application/octet-stream";
    }

    const options: {
        version: "v4" | "v2" | undefined;
        action: "write" | "read" | "delete" | "resumable",
        expires: number;
        contentType: string;
    } = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: mimeType,
    };

    const [url] = await storage.bucket(bucket).file(object).getSignedUrl(options);
    return url;
}

const generateV4GetObjectSignedUrl = 
    async (
        bucket: string, object: string): Promise<string> => {
            const options: {
                version: "v4" | "v2" | undefined;
                action: "write" | "read" | "delete" | "resumable",
                expires: number;
            } = {
                version: 'v4',
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            };

            const [url] = await storage
                .bucket(bucket)
                .file(object)
                .getSignedUrl(options);

            

        return url;
}

export const storeUrlAsDoc = async(url: string): Promise<string> => {
    const doc = await db.collection('urls').add({url: url});
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