import type { APIContext } from "astro";
import { arctic, getGitHubOAuth } from "@/lib/server/oauth";
import { setOAuthNextCookie, setOAuthStateCookie } from "@/lib/server/session";

export const prerender = false;

export async function GET({ cookies, redirect, request }: APIContext) {
  const github = getGitHubOAuth();
  if (!github) {
    return redirect("/?auth=error");
  }

  const nextPath = new URL(request.url).searchParams.get("next");

  const state = arctic.generateState();
  const url = github.createAuthorizationURL(state, ["read:user"]);

  setOAuthStateCookie(cookies, state, request);
  if (nextPath) {
    setOAuthNextCookie(cookies, nextPath, request);
  }

  return redirect(url.toString());
}
