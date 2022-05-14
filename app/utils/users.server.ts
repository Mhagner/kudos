import bcrypt from 'bcryptjs';
import type { RegisterForm } from './types.server';
import { prisma } from './prisma.server';

export const createUser = async (user: RegisterForm) => {
    const { email, firstName, lastName, password } = user
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: passwordHash,
            profile: {
                firstName,
                lastName,
            },
        },
    });

    return { id: newUser.id, email: user.email };
}