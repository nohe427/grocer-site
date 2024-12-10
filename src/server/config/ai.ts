import {genkit} from 'genkit';
import { vertexAI, gemini15Pro } from '@genkit-ai/vertexai';

export const ai = genkit({
    plugins: [
      // Load the Vertex AI plugin. You can optionally specify your project ID
      // by passing in a config object; if you don't, the Vertex AI plugin uses
      // the value from the GCLOUD_PROJECT environment variable.
      vertexAI({ location: 'us-central1' }),
    ],
    // Log debug output to tbe console.
    // logLevel: 'debug', -- Where is this? TODO:@nohe
    // Perform OpenTelemetry instrumentation and enable trace collection.
    // enableTracingAndMetrics: true, Where is this?? TODO: @nohe
    model: gemini15Pro,
  });