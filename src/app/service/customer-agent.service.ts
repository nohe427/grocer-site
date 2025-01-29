import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerAgentService {
  constructor(private httpClient: HttpClient) { }

  async askAgent(text?: string, image?: string): Promise<{traceId:string, result:string, spanId:string}> {
    return new Promise( async (resolve, reject) => {
      const prompt: { data: { text?: string, image?: string } } = { data: { text: text?.trim() || "", image: image || "" } };
      const returnValue: {spanId: string, traceId: string, result: string}  = {spanId: "", traceId: "", result: ""};

      try {
        const out = await this.httpClient.post(
          '/api/customerAgent',
          JSON.stringify(prompt),
          {
            responseType: 'json',
            observe: 'response',
            headers: {
              "Content-Type": "application/json" }});
        // const response = await fetch(
        //   '/api/customerAgent',
        //   // environment.genkitUrl,
        //   {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(prompt),
        //   }
        // );
        out.subscribe((response) => {
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
          console.log(response.headers)
    
          const responseSpanId = response.headers.get("x-genkit-span-id");
          // response.headers.forEach((k, v) => { console.log(k, v) })
          if (responseSpanId) {
            console.log(responseSpanId);
            returnValue.spanId = responseSpanId;
          }
    
          const responseTraceId = response.headers.get("x-genkit-trace-id");
          if (responseTraceId) {
            returnValue.traceId = responseTraceId;
          }
    
          const jsonString = JSON.stringify(response.body);
          const json = JSON.parse(jsonString);
          returnValue.result = json.result;
          resolve(returnValue);
        })
        
      } catch (e) {
        returnValue.result = (e as Error).message;
      }
    });
  }
}
