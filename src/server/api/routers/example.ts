import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import Vision from "@google-cloud/vision";
import { env } from "~/env.mjs";

const client = new Vision.ImageAnnotatorClient({
  credentials: {
    client_email: env.CLIENT_EMAIL,
    private_key: env.PRIVATE_KEY,
  },
  projectId: env.PROJECT_ID,
});

export const exampleRouter = createTRPCRouter({
  uploadImage: publicProcedure
    .input(z.object({ base64: z.string(), lang: z.string(), text: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const image64 = input.base64.split(",")[1];
        if (!image64) {
          console.log("SERVER: failed to parse base 64");
          return;
        }

        const [ocrResult] = await client.documentTextDetection({
          image: {
            content: image64,
          },
          imageContext: {
            languageHints: [input.lang],
          },
        });

        const textAnotations = ocrResult.textAnnotations ?? [];
        const parsedAnotations = [
          ...new Set(
            textAnotations.map((a) => a.description).filter(Boolean)
          ).values(),
        ];

        return parsedAnotations.map((a) => {
          if (a === input.text) {
            return [a, 100];
          }
          return [a, 0];
        });
      } catch {
        return;
      }
    }),
});
