import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
import type { LoginForm, RegisterForm } from "./types.server";
import { createUser } from "./users.server";

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
    throw new Error("SESSION_SECRET is not set")
}

const storage = createCookieSessionStorage({
    cookie: {
        name: 'kudos-session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    }
})

export async function register(user: RegisterForm) {
    const exists = await prisma.user.count({ where: { email: user.email } });

    if (exists) {
        return json({
            error: "User already exists with that email"
        }, {
            status: 400
        });
    }

    const newUser = await createUser(user);

    if (!newUser) {
        console.log(`Error creating user ${user.email} ${user.password}`);
        return json({
            error: "Failed to create user",
            fields: { email: user.email, password: user.password }
        }, {
            status: 400
        });
    }

    return createUserSession(newUser.id, '/');
}

export async function login({ email, password }: LoginForm) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || await bcrypt.compare(password, user.password)) {
        console.log(`Error logging in user ${user} ${user?.password}`);
        return json({
            error: "Invalid email or password"
        }, {
            status: 400
        });
    }

    return createUserSession(user.id, '/');
}

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();

    session.set('userId', userId);

    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session),
        },
    });
}