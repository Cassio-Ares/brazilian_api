import mongoose from 'mongoose';
import Adm from '../models/adm.model.js';
import { validationError } from '../validatorError/validationError.js';

export const getAdm = async (_, res) => {
  //#swagger.tags=['Admin']
  try {
    const adm = await Adm.find();
    return res.status(200).json(adm);
  } catch (error) {
    validationError(res, error);
  }
};

export const getByIdAdm = async (req, res) => {
  //#swagger.tags=['Admin']
  try {
    const { id } = req.params;
    // Verificar se o ID é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const adm = await Adm.findById(id);

    if (!adm) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    return res.status(200).json(adm);
  } catch (error) {
    validationError(res, error);
  }
};

export const createAdm = async (req, res) => {
  //#swagger.tags=['Admin']
  try {
    const adm = req.body;

    const admCreate = await Adm.create(adm);

    return res
      .status(201)
      .json({ message: 'Administrador criado com sucesso', admCreate });
  } catch (error) {
    validationError(res, error);
  }
};

export const updateAdm = async (req, res) => {
  //#swagger.tags=['Admin']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const data = req.body;

    const adm = await Adm.findByIdAndUpdate(id, data, { new: true });

    if (!adm) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    return res.status(200).json(adm);
  } catch (error) {
    validationError(res, error);
  }
};

export const removeAdm = async (req, res) => {
  //#swagger.tags=['Admin']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deleteAdm = await Adm.findByIdAndDelete(id);

    if (!deleteAdm) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    return res.status(200).json(deleteAdm);
  } catch (error) {
    validationError(res, error);
  }
};
