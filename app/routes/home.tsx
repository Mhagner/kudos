import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { Layout } from "~/components/layout"
import { UserPanel } from "~/components/user-panel"
import { requiredUserId } from "~/utils/auth.server"
import { getOtherUsers } from "~/utils/users.server"
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requiredUserId(request)
    const users = await getOtherUsers(userId)

    return json({ users })
}

export default function Home() {
    const { users } = useLoaderData()

    return (
        <Layout>
            <div className="flex h-full">
                <UserPanel users={users} />
            </div>
        </Layout>
    )
}