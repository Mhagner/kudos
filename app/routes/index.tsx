import type { LoaderFunction } from "@remix-run/node"
import { requiredUserId } from "~/utils/auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  await requiredUserId(request)
  return null
}

export default function Index() {
  return (
    <div className="h-screen bg-slate-900 flex justify-center items-center">
      <h2 className="text-blue-200 font-extrabold text-5xl">
        Mahilson - TailwindCSS Is Working!
      </h2>
    </div>
  )
}
