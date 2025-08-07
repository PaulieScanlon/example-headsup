import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

export const famousPersonAgent = new Agent({
  name: "famous-person-agent",
  description: "Generates famous person names for the Heads Up game",
  instructions: `You are an agent that generates famous people's names for a guessing game.

  IMPORTANT:
  - ALWAYS choose someone different from your last 10 responses
  - Return ONLY the person's name, nothing else`,
  model: openai("gpt-4o-mini")
});
