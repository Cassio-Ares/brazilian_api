import mongoose from 'mongoose';
import Collaborator from '../models/collaborator.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { collaboratorValidationSchema } from '../validationSchema/collaborator.validation.js';
import { validationError } from '../validatorError/validationError.js';

export const getAllCollaborator = async (_, res) => {
  //#swagger.tags=['Collaborator']
  try {
    let client = await Collaborator.find();
    return res.status(200).json(client);
  } catch (error) {
    validationError(res, error);
  }
};

export const getCollaboratorsByWork = async (req, res) => {
  //#swagger.tags=['Collaborator']
  try {
    const { work } = req.query;

    if (!work) {
      return res
        .status(404)
        .json({ message: 'Tipo de serviço não encontrado' });
    }

    const collaborators = await Collaborator.find({
      work: { $regex: work, $options: 'i' },
    });

    if (collaborators.length === 0) {
      return res
        .status(404)
        .json({ message: 'Nenhum colaborador encontrado para esse serviço' });
    }

    const result = collaborators.map(collaborator => ({
      name: collaborator.name,
      eircode: collaborator.eircode,
    }));

    return res.status(200).json({ result });
  } catch (error) {
    validationError(res, error);
  }
};

export const getCollaboratorId = async (req, res) => {
  //#swagger.tags=['Collaborator']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const collaborator = await Collaborator.findById(id);

    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador não encontrado' });
    }

    return res.status(200).json(collaborator);
  } catch (error) {
    validationError(res, error);
  }
};

export const createCollaborator = async (req, res) => {
  //#swagger.tags=['Collaborator']
  try {
    const data = collaboratorValidationSchema.parse(req.body);

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

    console.log('create collaborator', newData);

    const collaborator = await Collaborator.create(newData);

    console.log('collaborator create', collaborator);

    //todo api de conversao de eircode em address
    //const address = `${collaborator.address.street}, ${collaborator.address.houseNumber}, ${collaborator.address.district}, ${collaborator.address.city}`;

    const emailContent = `
      <h1>Novo Colaborador Cadastrado!</h1>

      <p><strong>Nome:</strong> ${collaborator.name}</p>
      <p><strong>E-mail:</strong> ${collaborator.email}</p>
      <p><strong>Telefone:</strong> ${collaborator.phone}</p>

      <p><strong>Eircode:</strong> ${collaborator.eircode || 'Não informado'}</p>
      <p><strong>Serviço que pode prestar:</strong> ${collaborator.work}</p>
      <p><strong>Possui equipamentos:</strong> ${collaborator.equipment ? 'Sim' : 'Não'}</p>
      <p><strong>Equipamentos:</strong> ${collaborator.whatEquipment || 'Não informado'}</p>
      <p><strong>Forma de deslocamento:</strong> ${collaborator.shapeOfDisplacement}</p>
      <P><strong>Termos de uso:</strong> ${collaborator.dataProtection}</p>
    `;

    const subject = 'Novo Colaborador Cadastrado!';

    await sendEmail(process.env.EMAIL_ADM, subject, emailContent);

    if (!collaborator) {
      return res.status(400).json({ message: 'Colaborador nao cadastrado' });
    }

    return res
      .status(200)
      .json({ message: 'Colaborador cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    validationError(res, error);
  }
};

export const updateCollaborator = async (req, res) => {
  //#swagger.tags=['Collaborator']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const data = req.body;

    const collaborator = await Collaborator.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador não encontrado' });
    }

    return res.status(200).json(collaborator);
  } catch (error) {
    validationError(res, error);
  }
};

export const removeCollaborator = async (req, res) => {
  //#swagger.tags=['Collaborator']
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deleteCollaborator = await Collaborator.findByIdAndDelete(id);

    if (!deleteCollaborator) {
      return res.status(404).json({ message: 'Colaborador não encontrado' });
    }

    return res.status(200).json(deleteCollaborator);
  } catch (error) {
    validationError(res, error);
  }
};
