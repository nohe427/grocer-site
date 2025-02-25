import { GenerateOptions, GenerationCommonConfigSchema, z } from "genkit"
import { ai } from "../config/ai"

export async function retryGenerate<O extends z.ZodTypeAny = z.ZodTypeAny, CustomOptions extends z.ZodTypeAny = typeof GenerationCommonConfigSchema>(
  options: GenerateOptions<O, CustomOptions> | PromiseLike<GenerateOptions<O, CustomOptions>>,
  maxAttempts = 4,
  attempt = 0) {
  if (attempt > maxAttempts) {
    throw new Error('Retries exhausted. Cannot generate content for prompt.')
  }
  try {
    const result = await ai.generate(options);
    if (result.text == "" && !result.media) {
      console.error("blank result", result.finishReason);
      return retryGenerate(options, maxAttempts, attempt + 1);
    }
    return result;
  } catch (error) {
    console.error(error);
    return retryGenerate(options, maxAttempts, attempt + 1);
  }
}
