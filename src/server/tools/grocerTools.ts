import { listStoreItems } from "@grocer/dc";
import { getDataconnectClient } from "../config/dataconnect";
import { ai } from '../config/ai';
import { gemini15Flash, gemini15Pro } from "@genkit-ai/vertexai";
import { z } from 'genkit';

const dc = getDataconnectClient();

export const generateRecipie = ai.defineTool({
    name: 'generateRecipie',
    description: 'Used to generate a recipie and a list of grocery items that need to be purchased to make the item. If no input is provided, come up with an american themed dish',
    // Define input and output schema so the model knows how to use the tool
    inputSchema: z.object({recipieRequest: z.string().optional()}),
    outputSchema: z.object({
        recipie: z.string().describe('The step by step recipie to make'),
        ingredients: z.object({ingredient: z.string().describe("the name of the ingredient"), quantity: z.string()}).array(),
    }).optional().describe('a recipie for a meal item'),
},
    async (input) => {
        const result = await ai.generate({
            model: gemini15Flash,
            prompt: `
    Generate a recipie that most people could make at home with ingredients they would find in a local grocery store.
    The recipie must try to match the users request.
    
    USER REQUEST: ${input.recipieRequest ? input.recipieRequest : "traditional american dinner"}
    `,
            output: {
              format: "json",
              schema: z.object({
                recipie: z.string().describe('The step by step recipie to make'),
                ingredients: z.object({ingredient: z.string().describe("the name of the ingredient"), quantity: z.string()}).array(),
            }).describe('a recipie for a meal item'),
            },
          });

          if (result.output == null) {
            return {recipie: "", ingredients: []}
          }
        
          return {recipie: result.output!.recipie, ingredients: result.output!.ingredients};
    }
);

export const findStoreItems = ai.defineTool({
    name: 'findStoreItems',
    description: 'used to locate the aisle of items in the store that need to be purchased for a recipie or as part of a shopppers trip to a store. name is the item name and category is the likely category that item would reside in wihtin a supermarket',
    inputSchema: z.object({itemName: z.string().describe('the name of the item'), itemCategory: z.string().describe('the likely category this item lives in')}),
    outputSchema: z.object({
        name: z.string(),
        aisle: z.number(),
        msrp: z.number(),
    }).array()
},
    async (input) => {
        const result = await listStoreItems(dc, {query: `NAME: ${input.itemName} CATEGORY: ${input.itemCategory}`})
        return result.data.storeItems_descEmbedding_similarity
    }
)

export const ingredientReplacement = ai.defineTool({
    name: 'ingredientReplacement',
    description: 'used to generate a replacement or alternative ingredient',
    inputSchema: z.object({outOfStockIngredient: z.string()}),
    outputSchema: z.object({
        alternatives: z.string().array().describe('a list of ingredients that are suitable to replace the outOfStockIngredient'),
    })
},
    async (input) => {
        const result = await ai.generate({
            model: gemini15Pro,
            prompt: `
    Fetch a list of possible alternatives for ${input.outOfStockIngredient}
    `,
            output: {
              format: "json",
              schema: z.object({
                alternatives: z.string().array().describe('a list of ingredients that are suitable to replace the outOfStockIngredient'),
            }),
            },
          });

          if (result.output == null) {
            return {alternatives: [],}
          }
        
          return {alternatives: result.output!.alternatives};
    }
);