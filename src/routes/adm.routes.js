import { Router } from "express";
import { connectDB } from "../configDB/connectDB.js";
import {
  createAdm,
  getAdm,
  getByIdAdm,
  removeAdm,
  updateAdm,
} from "../controllers/adm.controller.js";
import { acessAuth } from "../middleware/acessAuth.js";

export const routerAdm = Router();

routerAdm.get('/adm', acessAuth, connectDB, getAdm);
routerAdm.get("/adm/:id", acessAuth, connectDB, getByIdAdm);
routerAdm.post("/adm", connectDB, createAdm);
routerAdm.put("/adm/:id", acessAuth, connectDB, updateAdm);
routerAdm.delete("/adm/:id", acessAuth, connectDB, removeAdm);
