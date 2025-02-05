/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FirebaseOptions } from '@angular/fire/app';
import { AppCheck, CustomProvider, ReCaptchaEnterpriseProvider, ReCaptchaV3Provider } from '@angular/fire/app-check';

const devFirebaseConfig = {
  // Add the Firebase config object for your web app here
  // https://support.google.com/firebase/answer/7015592?hl=en#web&zippy=%2Cin-this-article
  "projectId":"lon-next",
  "appId":"1:1039410413539:web:70afda114ffd296afb2ad6",
  "storageBucket":"lon-next.firebasestorage.app",
  "apiKey":"AIzaSyDsfZ75K15WUutJxESZnIHxPAt6qo-_aXI",
  "authDomain":"lon-next.firebaseapp.com",
  "messagingSenderId":"1039410413539"
};

// TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
const appCheck = new ReCaptchaEnterpriseProvider("6LcnyboqAAAAAF5RKuAPmld7DSmllAbsk-LNorji");

const uploadImgUrl = '/api/storageUrls'; // "https://us-central1-lon-next.cloudfunctions.net/UploadImgTrip";
const genkitUrl = 'https://genkit-inst-1039410413539.us-central1.run.app/customerAgent'

export const environment: { 
    firebase: FirebaseOptions,
    appCheckProvider: CustomProvider | ReCaptchaV3Provider | ReCaptchaEnterpriseProvider
    uploadImgUrl: string,
    genkitUrl: string
} = {
  firebase: devFirebaseConfig,
  appCheckProvider: appCheck,
  uploadImgUrl: uploadImgUrl,
  genkitUrl: genkitUrl
};