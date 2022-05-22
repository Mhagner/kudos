import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node"
import { requiredUserId } from "~/utils/auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  await requiredUserId(request)
  return redirect("/home")
}

