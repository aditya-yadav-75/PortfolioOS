import { createApp } from './app';
import { config } from './config';
import { runMigrations } from './database/migrator';

async function bootstrap() {
  try {
    // Run database migrations on start
    runMigrations();
    console.log('Database schema validated and initialized.');

    const app = createApp();
    app.listen(config.port, () => {
      console.log(`PortfolioOS Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Gemini AI: ${config.geminiApiKey ? 'Configured (' + config.geminiModel + ')' : 'Using deterministic fallback (No API key set)'}`);
      console.log(`Google Sheets: ${config.googleSpreadsheetId ? 'Configured ID ' + config.googleSpreadsheetId : 'Not configured'}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
}

bootstrap();
