import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("http://localhost:3000");
  const sitemapURL = new URL("/sitemap.xml", base).href;

  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
