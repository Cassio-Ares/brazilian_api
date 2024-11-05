export const validationError = (res, err) => {
  const errorStr = String(err);

  // Verifica se é um erro de validação do Mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      status: "Erro",
      statusMensagem: "Erro de validação",
      respostas: messages,
    });
  }
  // Erro definido manualmente por você
  if (errorStr.includes(`Error:`)) {
    return res.status(400).json({
      status: "Erro",
      statusMensagem: errorStr.replace("Error: ", ""),
      resposta: errorStr,
    });
  }

  // Erro inesperado
  console.error(err);
  return res.status(500).json({
    status: "Erro",
    statusMensagem: "Houve um problema inesperado, tente novamente mais tarde.",
    resposta: errorStr,
  });
};
