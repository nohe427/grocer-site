import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

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
    const getUploadUrl = await fetch(environment.uploadImgUrl, {
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
