import { Router } from "express";
import { connectDB } from "../configDB/connectDB.js";
import {
  createClient,
  deleteClient,
  getAllClient,
  getClientById,
  getClientByName,
  updateClient,
} from "../controllers/client.controller.js";
import { acessAuth } from "../middleware/acessAuth.js";

export const routerClient = Router();

routerClient.get("/client", connectDB, getAllClient);
routerClient.get("/client/client",  connectDB, getClientByName);
routerClient.get("/client/:id", connectDB, getClientById);
routerClient.post("/client" ,connectDB, createClient);
routerClient.put("/client/:id", connectDB, updateClient);
routerClient.delete("/client/:id", connectDB, deleteClient);


