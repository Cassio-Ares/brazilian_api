import bcrypt from 'bcrypt';


export const crypt = async (password) => {
  const saltRounds = parseInt(process.env.HASH_PASSWORD);

  return await bcrypt.hash(password, saltRounds)
};

export const compareCrypt = async (password, passwordDB) => {
    return await bcrypt.compare(password, passwordDB)
};
