import { Router } from "express";
import {
  createWork,
  getAllWorks,
  getWorkByDay,
  getWorkByMonth,
  updateWork,
} from "../controllers/work.controller.js";
import { connectDB } from "../configDB/connectDB.js";
import { acessAuth } from "../middleware/acessAuth.js";

export const workRouter = Router();

workRouter.get('/work', acessAuth, connectDB, getAllWorks);
workRouter.get("/work/day", acessAuth,  connectDB, getWorkByDay);
workRouter.get("/work/search", acessAuth,  connectDB, getWorkByMonth);
workRouter.post("/work", acessAuth, connectDB, createWork);
workRouter.put("/work/:id", acessAuth, connectDB, updateWork);
