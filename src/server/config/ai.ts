import {genkit} from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry({
  projectId: 'lon-next',
  forceDevExport: true, // Set this to true to export telemetry for local runs
  autoInstrumentation: true,
});

export const ai = genkit({
    plugins: [
      // Load the Vertex AI plugin. You can optionally specify your project ID
      // by passing in a config object; if you don't, the Vertex AI plugin uses
      // the value from the GCLOUD_PROJECT environment variable.
      vertexAI({ location: 'us-central1', projectId: 'lon-next' }),
    ],
    // Log debug output to tbe console.
    // logLevel: 'debug', -- Where is this? TODO:@nohe
    // Perform OpenTelemetry instrumentation and enable trace collection.
    // enableTracingAndMetrics: true, Where is this?? TODO: @nohe
    model: vertexAI.model('gemini-2.5-pro'),
  });