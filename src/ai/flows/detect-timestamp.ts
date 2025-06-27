'use server';

/**
 * @fileOverview Detects and extracts a Unix epoch timestamp from a given text input.
 *
 * - detectTimestamp - A function that detects and extracts timestamp.
 * - DetectTimestampInput - The input type for the detectTimestamp function.
 * - DetectTimestampOutput - The return type for the detectTimestamp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectTimestampInputSchema = z.object({
  text: z.string().describe('The text to analyze for a Unix epoch timestamp.'),
});
export type DetectTimestampInput = z.infer<typeof DetectTimestampInputSchema>;

const DetectTimestampOutputSchema = z.object({
  timestamp: z
    .number()
    .optional()
    .describe('The detected Unix epoch timestamp, if found.'),
  confidence: z
    .number()
    .optional()
    .describe('The confidence level (0-1) of the timestamp detection.'),
});
export type DetectTimestampOutput = z.infer<typeof DetectTimestampOutputSchema>;

export async function detectTimestamp(input: DetectTimestampInput): Promise<DetectTimestampOutput> {
  return detectTimestampFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectTimestampPrompt',
  input: {schema: DetectTimestampInputSchema},
  output: {schema: DetectTimestampOutputSchema},
  prompt: `You are a helpful AI that detects Unix epoch timestamps within text.

  Given the following text, identify if it contains a Unix epoch timestamp.
  If a timestamp is found, extract the timestamp as a number and provide a confidence level (0-1) for the detection.
  If no timestamp is found, return an empty object.

  Text: {{{text}}}

  Output format: JSON
  {
    "timestamp": <timestamp>,
    "confidence": <confidence level>
  }
  `,
});

const detectTimestampFlow = ai.defineFlow(
  {
    name: 'detectTimestampFlow',
    inputSchema: DetectTimestampInputSchema,
    outputSchema: DetectTimestampOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (output) {
        // Attempt to parse the output.  If it fails, return an empty object.
        return output;
      } else {
        return {};
      }
    } catch (e) {
      console.error('Error during timestamp detection:', e);
      return {};
    }
  }
);
