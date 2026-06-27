/* global process */

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

const readJsonBody = async (request) =>
  new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });

const createVercelResponse = (response) => ({
  setHeader: (...args) => response.setHeader(...args),
  status(statusCode) {
    response.statusCode = statusCode;
    return this;
  },
  json(payload) {
    response.end(JSON.stringify(payload));
  },
});

const kulLlmDevApi = () => ({
  name: "kul-llm-dev-api",
  configureServer(server) {
    server.middlewares.use("/api/kul-llm", async (request, response) => {
      try {
        request.body = await readJsonBody(request);
        const apiModuleUrl = `${new URL(
          "./api/kul-llm.js",
          import.meta.url
        ).href}?update=${Date.now()}`;
        const { default: handler } = await import(apiModuleUrl);

        await handler(request, createVercelResponse(response));
      } catch {
        response.statusCode = 500;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(
          JSON.stringify({
            error: "Kul LLM local API failed. Please try again shortly.",
          })
        );
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.GOOGLE_AI_STUDIO_API_KEY =
    process.env.GOOGLE_AI_STUDIO_API_KEY || env.GOOGLE_AI_STUDIO_API_KEY;
  process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  process.env.GEMINI_MODEL = process.env.GEMINI_MODEL || env.GEMINI_MODEL;

  return {
    plugins: [react(), tailwindcss(), kulLlmDevApi()],
  };
});
