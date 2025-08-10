# Heads Up Game

A Mastra-powered Heads Up guessing game where users ask yes/no questions to figure out who the famous person is. This **multi-turn** workflow demonstrates suspend/resume capabilities, allowing for interactive gameplay where the AI remembers context across turns. Built with TypeScript, PostgreSQL, and AI agents for intelligent question answering and guess verification.

![Heads Up Game](https://raw.githubusercontent.com/PaulieScanlon/example-headsup/main/images/heads-up.jpg)

## Features

- 🤖 AI-powered question answering with context awareness
- 🎯 Intelligent guess verification that handles name variations
- 📊 Game statistics stored in PostgreSQL database
- 🔄 Suspend/resume workflow for interactive gameplay
- 🎮 Real-time game state tracking
- 🧠 Persistent agent memory
- 🌐 **Multiple interfaces** - Play via Mastra Playground or dedicated React frontend

## Multi-Turn Workflow

This game demonstrates a **multi-turn workflow** using Mastra's suspend/resume capabilities. Unlike traditional single-turn AI interactions, this workflow:

- **Remembers context** across multiple user interactions
- **Suspends execution** while waiting for user input
- **Resumes seamlessly** when the user responds
- **Tracks game state** (guess count, famous person, etc.) throughout the session

The workflow uses a `dountil` loop that continues asking questions until the correct person is guessed. Each iteration:

1. Suspends the workflow and waits for user input
2. Processes the user's question or guess
3. Updates the game state (incrementing guess count)
4. Either continues the loop or ends the game if the correct person is guessed

This pattern enables truly interactive AI experiences that maintain state and context across multiple turns.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or pnpm

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd example-headsup
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your PostgreSQL connection string:

   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/heads_up_db
   ```

4. **Set up the database**

   Create a PostgreSQL database and run the schema:

   ```bash
   psql -d heads_up_db -f schema.sql
   ```

## Development

### Start the development server

```bash
npm run dev
```

The Mastra development server will start on `http://localhost:4111`.

### Access the game

### Option 1: Mastra Playground (Recommended for development/testing)

1. Open your browser to `http://localhost:4111`
2. Navigate to the workflows section
3. Start the `headsUpWorkflow`
4. Begin playing!

### Option 2: React Frontend (Recommended for end users)

For a better user experience, you can also use the dedicated React frontend:

- **Repository**: [example-headsup-fe](https://github.com/PaulieScanlon/example-headsup-fe)
- **Features**: Clean chat interface, auto-scrolling, win detection, play again functionality
- **Setup**: Clone the frontend repo and configure it to connect to your Mastra server

The frontend provides a polished chat interface that connects directly to your `headsUpWorkflow` running on the Mastra server.

## How the Game Works

### Game Flow

1. **Start**: The AI generates a random famous person
2. **Questions**: Players ask yes/no questions about the person
3. **AI Responses**: The game agent answers based on actual facts about the person
4. **Guessing**: Players can guess the person's name at any time
5. **Verification**: A dedicated AI agent verifies guesses with name variation support
6. **Completion**: Game ends when the correct person is guessed

### AI Agents

- **Famous Person Agent**: Generates random famous people for the game with **persistent memory** to avoid repeating the same people across games
- **Game Agent**: Answers yes/no questions about the famous person
- **Guess Verifier Agent**: Verifies player guesses with intelligent name matching

### Database Storage

Game results are automatically saved to PostgreSQL with:

- Famous person's name
- Whether the game was won
- Number of guesses it took
- Timestamp

### Agent Memory

The **Famous Person Agent** uses Mastra's memory system with semantic recall to maintain a persistent list of previously suggested famous people. This ensures:

- **No repetition** - The agent never suggests the same person twice
- **Cross-session memory** - Memory persists even when the playground is refreshed
- **Diverse selection** - Chooses from actors, musicians, politicians, athletes, and other categories
- **Intelligent matching** - Uses semantic search to avoid similar names (e.g., "Beyoncé" vs "Beyoncé Knowles")

The memory is stored in a local SQLite database (`mastra.db`) and uses OpenAI's text embeddings for semantic similarity matching.

## Environment Variables

| Variable         | Description                  | Required |
| ---------------- | ---------------------------- | -------- |
| `DATABASE_URL`   | PostgreSQL connection string | Yes      |
| `OPENAI_API_KEY` | OpenAI API key for AI agents | Yes      |

### Example `.env` file

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/heads_up_db
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## Database Schema

The game uses a simple PostgreSQL table to store results:

```sql
CREATE TABLE heads_up_games (
    id SERIAL PRIMARY KEY,
    famous_person TEXT NOT NULL,
    game_won BOOLEAN NOT NULL,
    guess_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```
