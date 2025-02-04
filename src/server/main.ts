import {Storage, GetSignedUrlConfig} from '@google-cloud/storage';
import {v4} from 'uuid';

const project = 'lon-next';
const storage = new Storage({projectId: project});
const bucket = 'lon-next.firebasestorage.app';


export interface UploadUrls {
    uploadLocation: string,
    downloadLocation: string,
}

export const GenerateUploadUrls = async (mime: string): Promise<UploadUrls> => {
    const id = v4();
    const outputName = `tripediaPhotos/${id.toString()}`;
    const mimeType = mime;
    const putUrl = await generateV4PutObjectSignedUrl(bucket, outputName, mimeType)
    const getUrl = await generateV4GetObjectSignedUrl(bucket, outputName);
    return {
        uploadLocation: putUrl,
        downloadLocation: getUrl,
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