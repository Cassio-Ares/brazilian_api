import { Router } from 'express';
import { connectDB } from '../configDB/connectDB.js';
import {
  createClient,
  deleteClient,
  getAllClient,
  getClientById,
  getClientByName,
  updateClient,
} from '../controllers/client.controller.js';

export const routerClient = Router();

routerClient.get('/client', acessAuth, connectDB, getAllClient);
routerClient.get('/client/client', acessAuth, connectDB, getClientByName);
routerClient.get('/client/:id', acessAuth, connectDB, getClientById);
routerClient.post('/client', connectDB, createClient);
routerClient.put('/client/:id', acessAuth, connectDB, updateClient);
routerClient.delete('/client/:id', acessAuth, connectDB, deleteClient);
