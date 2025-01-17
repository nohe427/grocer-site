import { Injectable } from '@angular/core';

export interface UlDlJs {
  uploadLocation: string,
  downloadLocation: string,
}

@Injectable({
  providedIn: 'root'
})
export class UploadImgService {

  constructor() { }

  async uploadImg(fileMimeType: string, file: File) {
    const getUploadUrl = await fetch('https://us-central1-lon-next.cloudfunctions.net/UploadImgTrip', {
      method: 'GET',
      headers: { 'mime': fileMimeType }
    });
    const uploadJson: UlDlJs = await getUploadUrl.json();
    const uploadImg = await fetch(uploadJson.uploadLocation, {
      method: 'PUT',
      body: file,
    });
    return uploadJson;
  }
}
