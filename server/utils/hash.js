import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashData = async (data) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(data, salt);
};

export const compareData = async (data, hashedData) => {
  return bcrypt.compare(data, hashedData);
};
