import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';

export const settingsRouter = Router();
const controller = new SettingsController();

settingsRouter.get('/status', (req, res) => controller.getSystemStatus(req, res));
settingsRouter.post('/seed', (req, res) => controller.seedDemoData(req, res));
settingsRouter.post('/reset', (req, res) => controller.resetDatabase(req, res));
