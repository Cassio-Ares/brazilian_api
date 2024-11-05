import mongoose from 'mongoose';
import Works from '../models/admWork.model.js';
import Client from '../models/client.model.js';
import Collaborator from '../models/collaborator.model.js';
import { validationError } from '../validatorError/validationError.js';

export const getAllWorks = async (_, res) => {
  //#swagger.tags=['Works']
  try {
    const works = await Works.find()
      .populate('client')
      .populate('collaborator');

    return res.status(200).json(works);
  } catch (error) {
    validationError(res, error);
  }
};

export const getWorkByDay = async (req, res) => {
  //#swagger.tags=['Works']
  try {
    const { date } = req.query;

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Data inválida.' });
    }

    const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    const works = await Works.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate('client', 'name eircode')
      .populate('collaborator', 'name email');

    const formattedWorks = works.map(work => ({
      client: work.client.name,
      eircode: work.client.eircode || 'Endereço não cadastrado',
      email: work.collaborator.email,
      collaborator: work.collaborator.name,
      whichPlaces: work.whichPlaces || 'Não informado',
      work: work.work,
      price: work.price,
      status: work.status,
    }));

    return res.status(200).json(formattedWorks);
  } catch (error) {
    validationError(res, error);
    console.error(error);
  }
};

export const getWorkByMonth = async (req, res) => {
  //#swagger.tags=['Works']
  try {
    const { month, year } = req.query;

    if (!month || !year || isNaN(month) || isNaN(year)) {
      return res.status(400).json({ message: 'Parâmetros de data inválidos' });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const works = await Works.find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    })
      .populate('Client')
      .populate('Collaborator');

    return res.status(200).json(works);
  } catch (error) {
    validationError(res, error);
  }
};

export const createWork = async (req, res) => {
  //#swagger.tags=['Works']
  try {
    const { client, work, collaborator, whichPlaces, price, date, status } =
      req.body;

    const formatPrice = value => {
      let strValue = value.toString();

      strValue = strValue.replace(/[.,]/g, function (match, offset, string) {
        return offset === string.lastIndexOf('.') ||
          offset === string.lastIndexOf(',')
          ? match
          : '';
      });

      strValue = strValue.replace(',', '.');

      if (strValue.includes('.')) {
        let [reais, centavos] = strValue.split('.');

        if (centavos.length === 1) {
          centavos += '0';
        } else if (centavos.length > 2) {
          centavos = centavos.substring(0, 2);
        }

        return parseFloat(`${reais}.${centavos}`);
      } else {
        return parseFloat(`${strValue}.00`);
      }
    };

    if (!price) {
      return res.status(400).json({ message: 'Preço é obrigatório' });
    }

    const formattedPrice = formatPrice(price);

    const isValidClient = await Client.findOne({ name: client });
    if (!isValidClient) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (
      ![
        'serviço de limpeza',
        'paisagismo e jardinagem',
        'pintura',
        'manicure e pedicure',
        'costura',
      ].includes(work)
    ) {
      return res.status(400).json({ message: 'Tipo de serviço inválido' });
    }

    const availableCollaborators = await Collaborator.find({ work });
    if (availableCollaborators.length === 0) {
      return res.status(404).json({
        message: `Nenhum colaborador encontrado para o serviço de ${work}`,
      });
    }

    if (!collaborator) {
      return res.status(200).json({
        message: `Colaboradores disponíveis para o serviço de ${work}`,
        collaborators: availableCollaborators,
      });
    }

    const isValidCollaborator = availableCollaborators.find(
      coll => coll.name === collaborator,
    );

    if (!isValidCollaborator) {
      return res.status(404).json({
        message: `Colaborador selecionado não presta o serviço de ${work}`,
      });
    }

    const newWork = await Works.create({
      client: isValidClient._id,
      collaborator: isValidCollaborator._id,
      work,
      whichPlaces,
      price: formattedPrice,
      date,
      status,
    });

    return res.status(201).json(newWork);
  } catch (error) {
    validationError(res, error);
  }
};

export const updateWork = async (req, res) => {
  //#swagger.tags=['Works']
  try {
    const { id } = req.params;
    const { client, collaborator, ...updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    if (client) {
      return res.status(400).json({ message: 'Cliente não pode ser alterado' });
    }

    if (collaborator) {
      const isValidCollaborator = await Collaborator.find({
        name: collaborator,
      });

      if (!isValidCollaborator.length) {
        return res.status(400).json({ message: 'Colaborador não encontrado' });
      }

      const updatesWork = await Works.findByIdAndUpdate(
        id,
        {
          collaborator: isValidCollaborator[0]._id,
          ...updates,
        },
        {
          new: true,
        },
      );

      return res.status(200).json(updatesWork);
    }

    const updateWork = await Works.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return res.status(200).json(updateWork);
  } catch (error) {
    validationError(res, error);
  }
};
