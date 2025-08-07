# Heads Up Game

A Mastra-powered Heads Up guessing game where users ask yes/no questions to figure out who the famous person is. Built with TypeScript, PostgreSQL, and AI agents for intelligent question answering and guess verification.

## Features

- 🤖 AI-powered question answering with context awareness
- 🎯 Intelligent guess verification that handles name variations
- 📊 Game statistics stored in PostgreSQL database
- 🔄 Suspend/resume workflow for interactive gameplay
- 🎮 Real-time game state tracking

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

1. Open your browser to `http://localhost:4111`
2. Navigate to the workflows section
3. Start the `headsUpWorkflow`
4. Begin playing!

## How the Game Works

### Game Flow

1. **Start**: The AI generates a random famous person
2. **Questions**: Players ask yes/no questions about the person
3. **AI Responses**: The game agent answers based on actual facts about the person
4. **Guessing**: Players can guess the person's name at any time
5. **Verification**: A dedicated AI agent verifies guesses with name variation support
6. **Completion**: Game ends when the correct person is guessed

### AI Agents

- **Famous Person Agent**: Generates random famous people for the game
- **Game Agent**: Answers yes/no questions about the famous person
- **Guess Verifier Agent**: Verifies player guesses with intelligent name matching

### Database Storage

Game results are automatically saved to PostgreSQL with:

- Famous person's name
- Whether the game was won
- Number of guesses it took
- Timestamp

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

## Project Structure

```
src/
├── mastra/
│   ├── agents/
│   │   ├── example-famous-person-agent.ts
│   │   ├── example-game-agent.ts
│   │   └── example-guess-verifier-agent.ts
│   ├── workflows/
│   │   └── example-heads-up-workflow.ts
│   └── index.ts
├── schema.sql
└── .env.example
```

## Technologies Used

- **Mastra**: AI workflow orchestration
- **PostgreSQL**: Game statistics storage
- **TypeScript**: Type-safe development
- **OpenAI**: AI model for agents
- **pg**: PostgreSQL client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]
