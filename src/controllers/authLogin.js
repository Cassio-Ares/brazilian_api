import Adm from '../models/adm.model.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import { validationError } from '../validatorError/validationError.js';

export const authLogin = async (req, res) => {
  //#swagger.tags=['Login']
  try {
    const { email } = req.body;

    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Verificar se o usuário existe
    let adm = await Adm.findOne({ email });

    if (!adm) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Gera um token hexadecimal de 6 caracteres
    const token = crypto.randomBytes(3).toString('hex');

    // Definir o tempo de expiração do token (por exemplo, 10 minutos)
    const tokenExpires = Date.now() + 10 * 60 * 1000;

    // Atualizar o usuário com o token e a expiração
    adm.token = token;
    adm.tokenExpires = tokenExpires;

    await adm.save();

    // Definir o assunto e o conteúdo do e-mail
    const subject = 'Seu Token de Login';
    const emailContent = `
      <p>Olá,</p>
      <p>Seu token de login é: <strong>${token}</strong></p>
      <p>Este token é válido por 10 minutos.</p>
    `;

    // Enviar o e-mail com o token
    await sendEmail(email, subject, emailContent);

    // Retornar uma resposta de sucesso
    res.status(200).json({ message: 'Token enviado para o seu e-mail' });
  } catch (error) {
    validationError(res, error);
  }
};

export const validationToken = async (req, res) => {
  //#swagger.tags=['Login']
  try {
    const { email, token } = req.body;

    const adm = await Adm.findOne({ email });

    if (!adm) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o token está correto e ainda é válido
    if (adm.token !== token || Date.now() > adm.tokenExpires) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    // Criando um token
    let tokenAcc = jwt.sign({ id: adm._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Se tudo estiver correto, o login é bem-sucedido
    res.status(200).json({ token: tokenAcc });
  } catch (error) {
    validationError(res, error);
  }
};

