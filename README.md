# Angular on Firebase App Hosting

This is an example [Angular](https://angular.dev/) project to demonstrate SSG,
SSR, and deferrable views on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## Getting Started

Requirements to run locally:

Since the application requires permission to elevated permissions, you need to make sure that you can impersonate a service account that has the sign blob permission enabled for it.

Run this gcloud command to get the AppHosting Service Account for impersonation:

```
gcloud auth application-default login --impersonate-service-account=${APPHOSTING_SERVICE_ACCOUNT}
```

The APPHOSTING_SERVICE_ACCOUNT will look similar to the following format:

firebase-app-hosting-compute@project.iam.gserviceaccount.com

The apphosting service account must have the following roles applied:

* Cloud Trace Agent
* Developer Connect Read Token Accessor
* Firebase Admin SDK Administrator Service Agent
* Firebase App Hosting Compute Runner
* Logs Writer
* Monitoring Metric Writer
* Service Account Token Creator
* Vertex AI User

Additionally, you may need to add the `Service Account Token Creator` role to the principal impersonating the service account.

Run the development server:

```bash
npm run start
```

Open [http://localhost:4200](http://localhost:4200) with your browser to see the result.

## Deploy to Firebase App Hosting

### 1. Get your project set up on GitHub

[Create a new GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
and push the newly-initialized sample code to it:

<pre>
git remote add origin https://github.com/<b>$YOUR_NEW_REPOSITORY</b>.git
git branch -M main
git push -u origin main
</pre>

### 2. Set up Firebase App Hosting

Continue to [Get started with Firebase App Hosting](https://firebase.google.com/docs/app-hosting/get-started#step-1:).
