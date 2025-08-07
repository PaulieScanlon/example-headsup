import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { Pool } from "pg";

// PostgreSQL client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
});

// Global variable to track guess count across iterations
let guessCount = 0;

const startStep = createStep({
  id: "start-step",
  description: "Get the name of a famous person",
  inputSchema: z.object({
    start: z.boolean()
  }),
  outputSchema: z.object({
    famousPerson: z.string()
  }),
  execute: async ({ mastra }) => {
    const agent = mastra.getAgent("famousPersonAgent");
    const response = await agent.generate("Generate a famous person's name", {
      temperature: 1.2,
      topP: 0.9
    });
    const famousPerson = response.text.trim();
    return { famousPerson };
  }
});

const questionStep = createStep({
  id: "question-step",
  description: "Handle the complete question-answer-continue loop",
  inputSchema: z.object({
    famousPerson: z.string()
  }),
  resumeSchema: z.object({
    userMessage: z.string()
  }),
  suspendSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean(),
    agentResponse: z.string()
  }),
  execute: async ({ inputData, mastra, resumeData, suspend }) => {
    const { famousPerson } = inputData;
    const { userMessage } = resumeData ?? {};

    if (!userMessage) {
      // First time - ask for a question
      const message = "I'm thinking of a famous person. Ask me yes/no questions to figure out who it is!";
      await suspend({
        message
      });
      return { famousPerson, gameWon: false, agentResponse: message };
    }

    // Increment the global guess count
    guessCount++;

    // Check if the user's message is a guess by using the guess verifier agent
    const guessVerifier = mastra.getAgent("guessVerifierAgent");
    const verificationResponse = await guessVerifier.generate(`
      Actual famous person: ${famousPerson}
      User's guess: "${userMessage}"
      Is this correct?
    `);

    const verificationResult = JSON.parse(verificationResponse.text.trim());
    const gameWon = verificationResult.isCorrect;

    // Let the agent handle the user's message (question or guess)
    const agent = mastra.getAgent("gameAgent");

    const response = await agent.generate(`
      The famous person is: ${famousPerson}
      The user asked: "${userMessage}"
      Please respond appropriately.
    `);

    const agentResponse = response.text;

    console.log("");
    console.log("userMessage: ", userMessage);
    console.log("gameWon: ", gameWon);
    console.log("guessCount: ", guessCount);
    console.log("agentResponse: ", agentResponse);

    if (gameWon) {
      // It was a correct guess - don't suspend, just return so dountil can see the value
      return { famousPerson, gameWon, agentResponse };
    }

    // Show the agent's response and continue
    await suspend({
      message: response.text
    });

    return { famousPerson, gameWon, agentResponse };
  }
});

const winGameStep = createStep({
  id: "win-game-step",
  description: "Handle game win logic",
  inputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean(),
    agentResponse: z.string()
  }),
  outputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean(),
    guessCount: z.number()
  }),
  execute: async ({ inputData }) => {
    const { famousPerson, gameWon, agentResponse } = inputData;

    console.log("famousPerson", famousPerson);
    console.log("gameWon", gameWon);
    console.log("guessCount", guessCount);
    console.log("agentResponse", agentResponse);

    await pool.query("INSERT INTO heads_up_games (famous_person, game_won, guess_count) VALUES ($1, $2, $3)", [famousPerson, gameWon, guessCount]);

    return { famousPerson, gameWon, guessCount: guessCount };
  }
});

export const headsUpWorkflow = createWorkflow({
  id: "heads-up-workflow",
  inputSchema: z.object({
    start: z.boolean()
  }),
  outputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean(),
    guessCount: z.number()
  })
})
  .then(startStep)
  .dountil(questionStep, async ({ inputData: { gameWon } }) => gameWon)
  .then(winGameStep)
  .commit();
