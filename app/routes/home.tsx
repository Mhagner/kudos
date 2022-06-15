import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { Layout } from "~/components/layout"
import { UserPanel } from "~/components/user-panel"
import { requiredUserId } from "~/utils/auth.server"
import { getOtherUsers } from "~/utils/users.server"
import { Outlet, useLoaderData } from "@remix-run/react";
import type { Kudo as IKudo, Profile, Prisma } from "@prisma/client";
import { getFilteredKudos } from "~/utils/kudos.server";
import { Kudo } from "~/components/kudo";
import { SearchBar } from "~/components/search-bar";

interface KudoWithProfile extends IKudo {
    author: {
        profile: Profile
    }
}

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requiredUserId(request)
    const users = await getOtherUsers(userId)
    const url = new URL(request.url)
    const sort = url.searchParams.get('sort')
    const filter = url.searchParams.get('filter')

    let sortOptions: Prisma.KudoOrderByWithRelationInput = {}
    if (sort) {
        if (sort === 'date') {
            sortOptions = { createdAt: 'desc' }
        }
        if (sort === 'sender') {
            sortOptions = { author: { profile: { firstName: 'asc' } } }
        }
        if (sort === 'emoji') {
            sortOptions = { style: { emoji: 'asc' } }
        }
    }

    let textFilter: Prisma.KudoWhereInput = {}
    if (filter) {
        textFilter = {
            OR: [
                { message: { mode: 'insensitive', contains: filter } },
                {
                    author: {
                        OR: [
                            { profile: { is: { firstName: { mode: 'insensitive', contains: filter } } } },
                            { profile: { is: { lastName: { mode: 'insensitive', contains: filter } } } },
                        ],
                    },
                },
            ],
        }
    }

    const kudos = await getFilteredKudos(userId, sortOptions, textFilter)
    return json({ users, kudos })
}

export default function Home() {
    const { users, kudos } = useLoaderData()

    return (
        <Layout>
            <Outlet />
            <div className="flex h-full">
                <UserPanel users={users} />
                <div className="flex-1 flex flex-col">
                    <SearchBar />
                    <div className="flex-1 flex">
                        <div className="w-full p-10 flex flex-col gap-y-4">
                            {kudos.map((kudo: KudoWithProfile) => (
                                <Kudo key={kudo.id} kudo={kudo} profile={kudo.author.profile} />
                            ))}
                        </div>
                        {/* Recent Kudos Goes Here */}
                    </div>
                </div>
            </div>
        </Layout>
    )
}