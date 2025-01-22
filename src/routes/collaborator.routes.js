import { Router } from 'express';
import { connectDB } from '../configDB/connectDB.js';
import {
  createCollaborator,
  getAllCollaborator,
  getCollaboratorId,
  getCollaboratorsByWork,
  removeCollaborator,
  updateCollaborator,
} from '../controllers/collaborator.controller.js';

export const routerCollaborator = Router();

routerCollaborator.get(
  '/collaborator',
  acessAuth,
  connectDB,
  getAllCollaborator,
);
routerCollaborator.get(
  '/collaborator/work',
  acessAuth,
  connectDB,
  getCollaboratorsByWork,
);
routerCollaborator.get(
  '/collaborator/:id',
  acessAuth,
  connectDB,
  getCollaboratorId,
);
routerCollaborator.post('/collaborator', connectDB, createCollaborator);
routerCollaborator.put(
  '/collaborator/:id',
  acessAuth,
  connectDB,
  updateCollaborator,
);
routerCollaborator.delete(
  '/collaborator/:id',
  acessAuth,
  connectDB,
  removeCollaborator,
);
