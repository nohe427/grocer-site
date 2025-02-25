import { initializeApp } from "firebase-admin/app";
import { Storage } from '@google-cloud/storage';
import { getFirestore } from "firebase-admin/firestore";

export const app = initializeApp({projectId: 'lon-next'});

export const project = 'lon-next';
export const storage = new Storage({projectId: project});
export const bucket = 'lon-next.firebasestorage.app';
export const db = getFirestore(app);