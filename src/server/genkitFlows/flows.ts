// Import the Genkit core libraries and plugins.
import { ai } from '../config/ai';
import { z } from 'genkit';
import { collectUserEngagement, FirebaseUserEngagementSchema } from '@genkit-ai/firebase/user_engagement';

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
import { findStoreItems, generateRecipie, ingredientReplacement } from '../tools/grocerTools'
import { gemini20FlashExp } from '@genkit-ai/vertexai';

export const customerAgent = ai.defineFlow(
  {
    name: 'customerAgent',
    inputSchema: z.object({ text: z.string().optional(), image: z.string().optional() }),
    outputSchema: z.string(),
  },
  async (request) => {
    console.log(request.text);
    console.log(request.image);
    if (request.text == "" && request.image == "") {
      return "You must upload a request or an image"
    }
    // Construct a request and send it to the model API.
    if (request.text == "") {
      request.text = "Generate a recipe of the image"
    }
    const promptInput = [];
    if(request.text) {
        promptInput.push({text: request.text});
    }
    if(request.image) {
        promptInput.push({media: {url: request.image}});
    }
    const response = await ai.generate({
        system: `
        You are a helpful customer service representative for a grocery store.
        You can help folks come up with recipies for dinner, help build a shopping list,
        and help them find what they are looking for in store. Please help them with
        their request and include the recipie list and items they requested in your output.
        If you come up with a recipie but do not have the ingredients, try to find a suitable alternative
        or try to find a new recipie and let the user know you needed to pivot from their original
        request due to lack of ingredients.

        If someone uploads an image, determine what recipe to make by going to generateRecipie tool.

        Use findStoreItems to check for stock.
        Use findStoreItems to find the aisle that items are located in.
        Use findStoreItems to find where items are located. Return the aisle number, not the category.

        If you are listing ingredients in a recipie help them with the location via the aisle number of the ingredients.

        In your response to a recipie request, make sure you return the step by step instructions to the recipie and the ingredient list with their aisle in the store.

        If a user is looking for a replacement to an item using ingredientReplacement, report where the user can find the suggested item using findStoreItems.

        Each step in the step-by-step instructions should contain a markdown styled image from the images array that matches the order of the steps.

        Step by step instructions format:

        ![step instructions](url for the image to be rendered)
        Step Instruction in plain text

        Output should be in markdown format with the following headings:

        # Recipie Name

        ## Ingredients

        ## Step-by-step instructions
        `,
        prompt: promptInput,
        model: gemini20FlashExp,
        config: {
          temperature: 1,
        },
        tools: [generateRecipie, findStoreItems, ingredientReplacement]
    })
    // const llmResponse = await agent({
    //   text: request.text,
    //   image: request.image,
    // }, {
    //   tools: []
    // });
    return response.text;
  }
)

export const feedback = ai.defineFlow({
  name: 'feedback',
  inputSchema: FirebaseUserEngagementSchema,
  outputSchema: z.void(),
}, async (request) => {
  console.log(request);
  const schema = FirebaseUserEngagementSchema.parse(request);
  console.log(schema);
  collectUserEngagement(schema);
});

// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
// ai.startFlowServer({
//   flows: [customerAgent, feedback],
//   cors: {
//     origin: "*",
//     methods: "POST,GET",
//     exposedHeaders: ['x-genkit-trace-id', 'x-genkit-span-id']
//   },
// });
