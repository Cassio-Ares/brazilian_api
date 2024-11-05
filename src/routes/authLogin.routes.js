import {Router} from 'express';
import { authLogin, validationToken,  } from '../controllers/authLogin.js';
import { connectDB } from '../configDB/connectDB.js';

export const routerLogin = Router()

routerLogin.post('/admlogin',connectDB, authLogin)
routerLogin.post('/admtoken',connectDB, validationToken)