import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Modal } from "~/components/modal";
import { getUserById } from "~/utils/users.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    const { userId } = params;

    if (typeof userId !== "string") {
        return redirect("/home");
    }

    const recipient = await getUserById(userId)
    return json({ recipient })
}

export default function KudoModal() {
    const data = useLoaderData()

    const {
        profile: {
            firstName,
            lastName
        }
    } = data.recipient

    return (
        <Modal isOpen={true}>
            <h2>User: {firstName} {lastName}</h2>
        </Modal>
    )
}