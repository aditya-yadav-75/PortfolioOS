import { Router } from 'express';
import { SheetsController } from '../controllers/sheets.controller';

export const sheetsRouter = Router();
const controller = new SheetsController();

sheetsRouter.get('/status', (req, res) => controller.getStatus(req, res));
sheetsRouter.get('/logs', (req, res) => controller.getSyncLogs(req, res));
sheetsRouter.post('/export', (req, res) => controller.exportToSheets(req, res));
sheetsRouter.post('/import', (req, res) => controller.importFromSheets(req, res));
