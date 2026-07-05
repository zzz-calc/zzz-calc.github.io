import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const targetPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = normalize(join(root, targetPath));
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = createServer(async (request, response) => {
  const resolved = resolvePath(request.url || "/");
  if (!resolved) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(resolved);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(resolved)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch (_error) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`zzz-calc dev server: http://127.0.0.1:${port}/`);
});
