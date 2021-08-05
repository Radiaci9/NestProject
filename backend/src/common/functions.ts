import * as bcrypt from 'bcryptjs';

export const getHashedPassword = async (password) =>
  await bcrypt.hash(
    password,
    process.env.BCRIPT_SALT_ROUNDS
      ? Number.parseInt(process.env.BCRIPT_SALT_ROUNDS)
      : 5,
  );
