import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import Vision from "@google-cloud/vision";

const client = new Vision.ImageAnnotatorClient();

export const exampleRouter = createTRPCRouter({
  uploadImage: publicProcedure
    .input(z.object({ base64: z.string() }))
    .mutation(async ({ input }) => {
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
          languageHints: ["ja"],
        },
      });

      // console.log("SERVER1:", ocrResult.textAnnotations);
      // console.log("SERVER2:", ocrResult.fullTextAnnotation);

      return ocrResult;
    }),
});
