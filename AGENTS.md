# AGENTS.md

This file provides instructions and guidelines for agents working on this project.

## About this Project

This is an Angular project that uses Firebase App Hosting for SSG (Static Site Generation), SSR (Server-Side Rendering), and deferrable views. It also integrates with Genkit for AI-powered features and uses Firebase Data Connect for data management.

The backend is a Node.js Express server that handles server-side rendering and provides API endpoints for the frontend.

The frontend is an Angular application with a component-based architecture.

## Getting Started

### Prerequisites

- Node.js and npm
- Angular CLI
- Google Cloud SDK

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Service Account for Impersonation:**

    Since the application requires elevated permissions, you need to make sure that you can impersonate a service account that has the sign blob permission enabled for it.

    Run this gcloud command to get the AppHosting Service Account for impersonation:

    ```
    gcloud auth application-default login --impersonate-service-account=${APPHOSTING_SERVICE_ACCOUNT}
    ```

    The APPHOSTING_SERVICE_ACCOUNT will look similar to the following format:

    firebase-app-hosting-compute@project.iam.gserviceaccount.com

    The apphosting service account must have the following roles applied:

    *   Cloud Trace Agent
    *   Developer Connect Read Token Accessor
    *   Firebase Admin SDK Administrator Service Agent
    *   Firebase App Hosting Compute Runner
    *   Logs Writer
    *   Monitoring Metric Writer
    *   Service Account Token Creator
    *   Vertex AI User

    Additionally, you may need to add the `Service Account Token Creator` role to the principal impersonating the service account.

## Running the App

To run the development server, use the following command:

```bash
npm run start
```

This will start the Angular development server on `http://localhost:4200`.

To run the application with Server-Side Rendering (SSR) locally, use:

```bash
npm run dev:ssr
```

## Building the App

To build the application for production, use the following command:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

To run the unit tests, use the following command:

```bash
npm run test
```

This will run the tests using Karma and Jasmine.

## Deployment

This project is configured for deployment to Firebase App Hosting.

1.  **Set up your project on GitHub:**
    Create a new GitHub repository and push your code to it.

2.  **Set up Firebase App Hosting:**
    Follow the instructions in the [Firebase App Hosting documentation](https://firebase.google.com/docs/app-hosting/get-started#step-1:) to connect your GitHub repository and deploy the application.

## Project Structure

```
.
├── dataconnect/      # Firebase Data Connect configuration
├── dist/             # Build output
├── generatedGrocer/  # Generated code from Data Connect
├── src/              # Application source code
│   ├── app/          # Angular application components, services, etc.
│   ├── assets/       # Static assets
│   ├── environments/ # Environment-specific configuration
│   ├── server/       # Server-side code (Express, Genkit flows)
│   └── ...
├── .firebaserc       # Firebase project configuration
├── angular.json      # Angular CLI configuration
├── apphosting.yaml   # Firebase App Hosting configuration
├── firebase.json     # Firebase services configuration
├── package.json      # Project dependencies and scripts
└── server.ts         # Express server entry point
```

## Key Technologies

- **Angular**: Frontend framework
- **Node.js**: JavaScript runtime for the backend
- **Express**: Web application framework for Node.js
- **TypeScript**: Programming language
- **Firebase**: Backend platform
  - **App Hosting**: Hosting for web apps
  - **Data Connect**: GraphQL-based data access layer
- **Genkit**: AI framework for building and deploying AI-powered features
- **Google Cloud**: Cloud platform for hosting and services
- **Karma & Jasmine**: Testing frameworks
- **SCSS**: CSS preprocessor
