import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLVector } from "@mastra/libsql";

export const famousPersonAgent = new Agent({
  name: "famous-person-agent",
  description: "Generates famous person names for the Heads Up game",
  instructions: `You are an agent that generates famous people's names for a guessing game.

  IMPORTANT:
  - Use your memory to check what famous people you've already suggested
  - NEVER repeat a person you've already suggested in your memory
  - Choose from a diverse range of people (actors, musicians, politicians, athletes, etc.)
  - Return ONLY the person's name, nothing else
  - After suggesting someone, add them to your memory so you don't repeat them
  `,
  model: openai("gpt-4o-mini"),
  memory: new Memory({
    vector: new LibSQLVector({
      connectionUrl: "file:../mastra.db"
    }),
    embedder: openai.embedding("text-embedding-3-small"),
    options: {
      lastMessages: 5,
      semanticRecall: {
        topK: 10,
        messageRange: 1
      }
    }
  })
});
