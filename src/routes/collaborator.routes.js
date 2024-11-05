import { Router } from "express";
import { connectDB } from "../configDB/connectDB.js";
import {
  createCollaborator,
  getAllCollaborator,
  getCollaboratorId,
  getCollaboratorsByWork,
  removeCollaborator,
  updateCollaborator
} from "../controllers/collaborator.controller.js";
import { acessAuth } from "../middleware/acessAuth.js";

export const routerCollaborator = Router();


routerCollaborator.get("/collaborator", connectDB, getAllCollaborator);
routerCollaborator.get("/collaborator/work", connectDB, getCollaboratorsByWork);
routerCollaborator.get("/collaborator/:id", connectDB, getCollaboratorId);
routerCollaborator.post("/collaborator", connectDB,createCollaborator);
routerCollaborator.put("/collaborator/:id",  connectDB, updateCollaborator);
routerCollaborator.delete("/collaborator/:id", connectDB, removeCollaborator);



