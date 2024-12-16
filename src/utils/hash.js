import { compare, hash } from 'bcrypt';

export async function hashPassword(password) {
	return await hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
	return compare(password, hashedPassword);
}
