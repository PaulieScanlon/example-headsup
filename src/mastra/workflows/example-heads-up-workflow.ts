import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import stringSimilarity from "string-similarity";

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
  outputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean()
  }),
  execute: async ({ inputData, mastra, resumeData, suspend }) => {
    const { famousPerson } = inputData;
    const { userMessage } = resumeData ?? {};

    console.log("questionStep executed with inputData:", inputData);
    console.log("");

    if (!userMessage) {
      // First time - ask for a question
      const message = "I'm thinking of a famous person. Ask me yes/no questions to figure out who it is!";
      console.log("message: ", message);
      console.log("famousPerson: ", famousPerson);
      await suspend({
        message
      });
      return { famousPerson, gameWon: false };
    }

    // Check if the user's message matches the famous person's name using string similarity
    const similarity = stringSimilarity.compareTwoStrings(userMessage.toLowerCase(), famousPerson.toLowerCase());
    const gameWon = similarity > 0.6; // Threshold for considering it a match

    // Let the agent handle the user's message (question or guess)
    const agent = mastra.getAgent("gameAgent");

    const response = await agent.generate(`
      The famous person is: ${famousPerson}.
      The user said: "${userMessage}"
      Is this a correct guess? ${gameWon ? "YES" : "NO"}
      Please respond appropriately.`);

    console.log("userMessage: ", userMessage);
    console.log("famousPerson: ", famousPerson);
    console.log("gameWon: ", gameWon);
    console.log("response.text: ", response.text);

    if (gameWon) {
      // It was a correct guess - don't suspend, just return so dountil can see the value
      return { famousPerson, gameWon };
    }

    // Show the agent's response and continue
    await suspend({
      message: `${response.text}`
    });

    return { famousPerson, gameWon };
  }
});

const winGameStep = createStep({
  id: "win-game-step",
  description: "Handle game win logic",
  inputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean()
  }),
  outputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean()
  }),
  execute: async ({ inputData }) => {
    const { famousPerson, gameWon } = inputData;

    console.log("famousPerson", famousPerson);
    console.log("gameWon", gameWon);

    return { famousPerson, gameWon };
  }
});

export const headsUpWorkflow = createWorkflow({
  id: "heads-up-workflow",
  inputSchema: z.object({
    start: z.boolean()
  }),
  outputSchema: z.object({
    famousPerson: z.string(),
    gameWon: z.boolean()
  })
})
  .then(startStep)
  .dountil(questionStep, async ({ inputData: { gameWon } }) => gameWon)
  .then(winGameStep)
  .commit();
