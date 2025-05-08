import bcrypt from "bcryptjs";

export const hash = async (password: string): Promise<string> => await bcrypt.hash(password, bcrypt.genSaltSync(10));
export const compare = async (password: string, hash: string): Promise<boolean> => await bcrypt.compare(password, hash);
