import jwt from "jsonwebtoken";

export const acessAuth = (req, res, next) => {
  try {
    const token = req.token;

    if (!token) {
      return res.status(401).json({ message: "Acesso negado." });
    }

    const isValid = jwt.verify(token, process.env.JWT_SECRET);

    if (!isValid) {
      return res.status(401).json({ message: "Acesso negado." });
    }

    req.user = isValid;

    next();
  } catch (error) {
    console.log(error);
  }
};
