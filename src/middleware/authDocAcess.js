import auth from 'basic-auth';

export const authDocAcess = (req, res, next) => {
  const user = auth(req);

  if (
    !user ||
    user.name !== process.env.BASIC_AUTH_USER ||
    user.pass !== process.env.BASIC_AUTH_PASS
  ) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Document Access"');
    return res.status(401).json({ message: 'Acesso negado.' });
  }

  next();
};
