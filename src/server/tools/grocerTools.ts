import { listStoreItems } from "@grocer/dc";
import { getDataconnectClient } from "../config/dataconnect";
import { ai } from '../config/ai';
import { gemini20FlashExp, imagen3Fast } from "@genkit-ai/vertexai";
import { z } from 'genkit';
import { generateRecipeStepImg } from './imageGen';

const dc = getDataconnectClient();

export const generateRecipie = ai.defineTool({
    name: 'generateRecipie',
    description: 'Used to generate a recipie and a list of grocery items that need to be purchased to make the item. If no input is provided, come up with an american themed dish',
    // Define input and output schema so the model knows how to use the tool
    inputSchema: z.object({recipieRequest: z.string().optional()}),
    outputSchema: z.object({
        recipie: z.string().describe('The step by step recipie to make').array(),
        ingredients: z.object({ingredient: z.string().describe("the name of the ingredient"), quantity: z.string()}).array(),
        images: z.string().describe('The images that accompany the step by step recipie instructions').array().optional(),
    }).optional().describe('a recipie for a meal item'),
},
    async (input) => {
        const images = [];
        const result = await ai.generate({
            model: gemini20FlashExp,
            prompt: `
    Generate a recipie that most people could make at home with ingredients they would find in a local grocery store.
    The recipie must try to match the users request.
    
    USER REQUEST: ${input.recipieRequest ? input.recipieRequest : "traditional american dinner"}
    `,
            output: {
              format: "json",
              schema: z.object({
                recipie: z.string().describe('The step by step recipie to make').array(),
                ingredients: z.object({ingredient: z.string().describe("the name of the ingredient"), quantity: z.string()}).array(),
            }).describe('a recipie for a meal item'),
            },
          });

          const output = result.output;
          if (output == null) {
            return {recipie: [], ingredients: []}
          }
          
          console.log(output.recipie.length);
          if (output.recipie.length > 0) {
            const promises = [];
            for(let i = 0; i < output.recipie.length; i++) {
                promises.push(
                    generateRecipeStepImg(
                        {
                            currentStep: output.recipie[i],
                            previousSteps: output.recipie.slice(0, i)
                        }
                    )
                );
            }
            images.push(...(await Promise.all(promises)));

          }
        
          return {
            recipie: output.recipie,
            ingredients: output.ingredients,
            images: images};
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
            model: gemini20FlashExp,
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