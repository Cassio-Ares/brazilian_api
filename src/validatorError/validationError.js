import { z } from 'zod';

export const validationError = (res, err) => {
  const errorStr = String(err);

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    const messages = err.errors.map(error => ({
      field: error.path[0],
      message: error.message,
    }));

    return res.status(400).json({
      status: 'Erro',
      statusMensagem: 'Erro de validação',
      respostas: messages,
    });
  }

  // Existing Mongoose validation error handling
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      status: 'Erro',
      statusMensagem: 'Erro de validação',
      respostas: messages,
    });
  }

  // Manually defined error
  if (errorStr.includes(`Error:`)) {
    return res.status(400).json({
      status: 'Erro',
      statusMensagem: errorStr.replace('Error: ', ''),
      resposta: errorStr,
    });
  }

  // Unexpected error
  console.error(err);
  return res.status(500).json({
    status: 'Erro',
    statusMensagem: 'Houve um problema inesperado, tente novamente mais tarde.',
    resposta: errorStr,
  });
};
