import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLVector } from "@mastra/libsql";

export const famousPersonAgent = new Agent({
  name: "Famous Person Generator",
  instructions: `You are a famous person generator for a "Heads Up" guessing game.

Generate the name of a well-known famous person who:
- Is recognizable to most people
- Has distinctive characteristics that can be described with yes/no questions
- Is appropriate for all audiences
- Has a clear, unambiguous name

Examples: Albert Einstein, Beyoncé, Leonardo da Vinci, Oprah Winfrey, Michael Jordan

Return only the person's name, nothing else.`,
  model: openai("gpt-4o-mini"),
  tools: {}
});
