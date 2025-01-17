import mongoose from 'mongoose';
import Client from '../models/client.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { validationError } from '../validatorError/validationError.js';

export const getAllClient = async (_, res) => {
  //#swagger.tags=['Client']
  try {
    const clients = await Client.find();

    return res.status(200).json(clients);
  } catch (error) {
    validationError(res, error);
  }
};

export const getClientById = async (req, res) => {
  //#swagger.tags=['Client']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    return res.status(200).json(client);
  } catch (error) {
    validationError(res, error);
  }
};

export const getClientByName = async (req, res) => {
  //#swagger.tags=['Client']
  try {
    const { name } = req.query;

    // Busca por regex para permitir pequenas variações no nome
    const client = await Client.findOne({
      name: { $regex: name, $options: 'i' },
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    return res.status(200).json({ eircode: client.eircode });
  } catch (error) {
    validationError(res, error);
  }
};

export const createClient = async (req, res) => {
  //#swagger.tags=['Client']
  try {
    const data = req.body;

    let consentDate;

    if (data.dataProtection === true) {
      consentDate = new Date();
    }

    //Verificar recaptcha
    const recaptchaRes = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.captchaToken}`,
      },
    );

    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ message: 'Verificação do CAPTCHA falhou' });
    }

    const newData = {
      ...data,
      consentDate,
    };
    console.log(newData);

    const client = await Client.create(newData);
    console.log(client);

    const address = `${client.address.street}, ${client.address.houseNumber}, ${client.address.district}, ${client.address.city}`;

    const emailContent = `
    <h1>Novo Cliente Cadastrado!</h1>
    <p><strong>Nome:</strong> ${client.name}</p>
    <p><strong>Email:</strong> ${client.email}</p>
    <p><strong>Telefone:</strong> ${client.phone}</p>
    <p><strong>Endereço:</strong> ${address}</p>
    <p><strong>Eircode:</strong> ${client.eircode}</p>
    <p><strong>Tipo de Serviço:</strong> ${client.typeOfWork}</p>
    <p><strong>Data do Serviço:</strong> ${client.dateOfService}</p>
    <p><strong>Como encontrou a empresa:</strong> ${client.howFindCompany}</p>
    <p><strong>Nome do Indicador:</strong> ${client.indicatorName || 'Não informado'}</p>
    <p><strong>Particularidades:</strong> ${client.particularities || 'Nenhuma'}</p>
    <p><strong>Termos de uso:</strong> ${client.dataProtection}</p>
`;

    const subject = 'Novo Cliente Cadastrado!';

    await sendEmail(process.env.EMAIL_ADM, subject, emailContent);

    return res.status(200).json(client);
  } catch (error) {
    console.log(error);
    validationError(res, error);
  }
};

export const updateClient = async (req, res) => {
  //#swagger.tags=['Client']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const data = req.body;

    const client = await Client.findByIdAndUpdate(id, data, { new: true });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    return res.status(200).json(client);
  } catch (error) {
    validationError(res, error);
  }
};

export const deleteClient = async (req, res) => {
  //#swagger.tags=['Client']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deleteClient = await Client.findByIdAndDelete(id);

    if (!deleteClient) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    return res.status(200).json(deleteClient);
  } catch (error) {
    validationError(res, error);
  }
};
