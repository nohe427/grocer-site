import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerAgentService {
  constructor() { }

  async askAgent(text?: string, image?: string) {
    const prompt: { data: { text?: string, image?: string } } = { data: { text: text?.trim() || "", image: image || "" } };
    const returnValue: {spanId: string, traceId: string, result: string}  = {spanId: "", traceId: "", result: ""};

    try {
      const response = await fetch(
        environment.genkitUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prompt),
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      console.log(response.headers)

      const responseSpanId = response.headers.get("x-genkit-span-id");
      response.headers.forEach((k, v) => { console.log(k, v) })
      if (responseSpanId) {
        console.log(responseSpanId);
        returnValue.spanId = responseSpanId;
      }

      const responseTraceId = response.headers.get("x-genkit-trace-id");
      if (responseTraceId) {
        returnValue.traceId = responseTraceId;
      }

      const json = await response.json();
      returnValue.result = json.result;
    } catch (e) {
      returnValue.result = (e as Error).message;
    }
    return returnValue;
  }
}
