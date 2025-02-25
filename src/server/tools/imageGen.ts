import { z } from 'genkit';
import {ai} from '../config/ai';
import { gemini15Flash, imagen3 } from '@genkit-ai/vertexai';
import axios from 'axios';
import { GenerateUploadUrls } from '../utils/images';

const powerUpImgPrompt = ai.defineFlow({
  name: 'powerUpImgPrompt',
  inputSchema: z.object({
    style: z.string().optional().describe('a style to apply to the images. Defaults to "modern clearn"'),
    currentStep: z.string(),
    previousSteps: z.string().array().optional()
    }
  ),
  outputSchema: z.string(),
},
  async (request) => {
    request.style = request.style || "modern clean";
    const output = await ai.generate({
        model: gemini15Flash,
        prompt:`
        Please generate me a prompt for an image generation system that would
        create an image of this recipe step in a ${request.style} kitchen. The
        prompt should be extremely detailed and about two paragraphs long.

        PREVIOUS STEPS:
        ${request.previousSteps ?
            request.previousSteps.join("\n") : "No previous steps"}
        CURRENT STEP: ${request.currentStep}
        
    `})
    return output.text;
});

export const generateRecipeStepImg = ai.defineFlow({
    name: 'generateRecipeStepImg',
    inputSchema: z.object({
        currentStep: z.string(),
        previousSteps: z.string().array().optional(),
        style: z.string().optional(),
    }),
    outputSchema: z.string(),
    },
    async (request) => {
        const prompt = await powerUpImgPrompt(request);
        let img: any;
        try {
             img = await ai.generate({
                prompt: prompt,
                model: imagen3,
            });
        } catch(ex) {
            console.log(ex);
            return "";
        }
        const media: {url: string, contentType?: string} = img.media
        if(!media) {
            return "";
        }
        const outUrl = await uploadImg(media.url, media.contentType);
        console.log(media.contentType, outUrl);
        return outUrl;
    }

);

const uploadImg = async (data: string, contentType?: string) => {
    if(!contentType) {
        contentType = 'image/png';
    }
    const UpDlJs = await GenerateUploadUrls(contentType, 'example1.nohe-example.xyz');
    const uploadLocation = UpDlJs.uploadLocation;
    const downloadLocation = UpDlJs.downloadLocation;

    const response = await axios.put(
        uploadLocation,
        Buffer.from(
            data.replace(/^data:image\/png;base64,/, ""),
            'base64'
        ), {headers: {
            'Content-Type': contentType,
        }
    });
    if(response.status=200) {
        return downloadLocation;
    }
    return "";
}