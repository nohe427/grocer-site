// Import the Genkit core libraries and plugins.
import {ai} from './config/ai';
import { z } from 'genkit';

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
import {findStoreItems, generateRecipie, ingredientReplacement} from './tools/grocerTools'

export const customerAgent = ai.defineFlow(
  {
    name: 'customerAgent',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (request) => {
		// Construct a request and send it to the model API.
    const llmResponse = await ai.generate({
      prompt: `
      You are a helpful customer service representative for a grocery store.
      You can help folks come up with recipies for dinner, help build a shopping list,
      and help them find what they are looking for in store. Please help them with
      their request and include the recipie list and items they requested in your output.
      If you come up with a recipie but do not have the ingredients, try to find a suitable alternative
      or try to find a new recipie and let the user know you needed to pivot from their original
      request due to lack of ingredients.

      Use findStoreItems to check for stock.
      Use findStoreItems to find the aisle that items are located in.
      Use findStoreItems to find where items are located. Return the aisle number, not the category.

      If you are listing ingredients in a recipie help them with the location via the aisle number of the ingredients.

      In your response to a recipie request, make sure you return the full steps to the recipie and the ingredient list with their aisle in the store.

      If a user is looking for a replacement to an item using ingredientReplacement, report where the user can find the suggested item using findStoreItems.

      REQUEST : ${request}
      `,
      config: {
        temperature: 1,
      },
      tools: [generateRecipie, findStoreItems, ingredientReplacement]
    });

		// Handle the response from the model API. In this sample, we just convert
    // it to a string, but more complicated flows might coerce the response into
    // structured output or chain the response into another LLM call, etc.
    return llmResponse.text;
  }
)

// A simple flow.
// export const customerAgent = defineFlow(
//   {
//     name: 'customerAgent',
//     inputSchema: z.string(),
//     outputSchema: z.string(),
//   },
//   async (request) => {
// 		// Construct a request and send it to the model API.
//     const llmResponse = await generate({
//       prompt: `
//       You are a helpful customer service representative for a grocery store.
//       You can help folks come up with recipies for dinner, help build a shopping list,
//       and help them find what they are looking for in store. Please help them with
//       their request and include the recipie list and items they requested in your output.
//       If you come up with a recipie but do not have the ingredients, try to find a suitable alternative
//       or try to find a new recipie and let the user know you needed to pivot from their original
//       request due to lack of ingredients.

//       Use findStoreItems to check for stock.
//       Use findStoreItems to find the aisle that items are located in.
//       Use findStoreItems to find where items are located. Return the aisle number, not the category.

//       If you are listing ingredients in a recipie help them with the location via the aisle number of the ingredients.

//       In your response to a recipie request, make sure you return the full steps to the recipie and the ingredient list with their aisle in the store.

//       If a user is looking for a replacement to an item using ingredientReplacement, report where the user can find the suggested item using findStoreItems.

//       REQUEST : ${request}
//       `,
//       model: gemini15Pro,
//       config: {
//         temperature: 1,
//       },
//       tools: [generateRecipie, findStoreItems, ingredientReplacement]
//     });

// 		// Handle the response from the model API. In this sample, we just convert
//     // it to a string, but more complicated flows might coerce the response into
//     // structured output or chain the response into another LLM call, etc.
//     return llmResponse.text();
//   }
// );

// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
ai.startFlowServer({
  flows: [customerAgent],
});