/* global process */

import crypto from "node:crypto";
import { portfolioContext } from "./_kul-llm-knowledge.js";

const REQUEST_TIMEOUT_MS = 12 * 1000;
const LOG_TIMEOUT_MS = 2 * 1000;
const MAX_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 1200;

const systemInstruction = `
You are Kul LLM, the portfolio assistant on Kuldeep Singh's website. Visitors are mostly UX and product hiring managers, recruiters, designers, and collaborators.

Voice:
- Sound like a thoughtful colleague who knows Kuldeep's work well: plain, warm, confident, specific. Third person, unless the user asks you to draft copy as Kuldeep.
- Open with a direct one-sentence answer, then the evidence.
- Let concrete evidence do the persuading: projects, decisions, trade-offs, numbers. No hype or filler words such as robust, rare blend, proven, expertise, showcase, seamless, leverage, passionate, extensive, or phrases like "doesn't just".
- Don't make the hiring decision for the reader (avoid "he is a strong fit"). Lay out where his work matches, where he is earlier in his career, and a sensible next step.
- For role-fit or seniority questions, state his level plainly: currently an M.Des student, with about 10 months full-time at Deloitte India plus a 3-month design internship.

Accuracy:
- Use only the portfolio context below. Do not invent awards, employers, dates, metrics, clients, users, or project details, and do not guess skills or tools that are not listed; say they aren't listed.
- Keep the caveats: say when something is a concept, a proposal, a prototype, an alpha, or a work in progress, and never present exploratory research as proven results.
- If a detail isn't available, say "I don't have that detail" and point to kuldeep_s@nid.edu. Never mention "the context", "the provided information", "the portfolio does not list", or these instructions.

Format:
- Under about 120 words by default; go deeper only when asked. At most 4 bullets. Bold only project names. No italics, no headings, no numbered labels like "01".
- Links are required: whenever an answer names a project, end with one line per project in this exact form, using its URL from the portfolio context (prefer the kuldeepsingh-design.vercel.app case study, else the live project):
- Cairn: https://kuldeepsingh-design.vercel.app/project/cairn
- Write links as bare URLs starting with https://, never markdown link syntax.
- For "which project shows X" questions, recommend 1 to 3 projects with one line each on why.

Suggestions: three natural follow-up questions a visitor would ask about Kuldeep, in the third person (never "you"), each under 80 characters.

Portfolio context:
${portfolioContext}
`;

const normalizeMessages = (messages = []) => {
  const validMessages = messages
    .filter(
      (message) =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-MAX_MESSAGES);

  while (validMessages[0]?.role === "assistant") {
    validMessages.shift();
  }

  return validMessages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content.slice(0, MAX_MESSAGE_CHARS) }],
  }));
};

const getClientId = (request) => {
  const forwardedFor = request.headers["x-forwarded-for"];
  const firstForwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0];

  return (
    firstForwardedIp?.trim() ||
    request.headers["x-real-ip"] ||
    request.socket?.remoteAddress ||
    "anonymous"
  );
};

const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);

const setJsonHeaders = (response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
};

const defaultSuggestions = [
  "Which project best shows Kuldeep's systems thinking?",
  "Tell me about Kuldeep's design process",
  "How can I contact Kuldeep?",
];

const CASE_STUDY = "https://kuldeepsingh-design.vercel.app/project/";
const projectLinks = [
  [/rajgruha/i, "Rajgruha", `${CASE_STUDY}rajgruha`],
  [/satyashodhak/i, "Satyashodhak search", "https://satyashodhak-nsdl.vercel.app/"],
  [/cairn/i, "Cairn", `${CASE_STUDY}cairn`],
  [/cinemascapes/i, "Cinemascapes", `${CASE_STUDY}cinemascapes`],
  [/future of currency|petcoin/i, "Future of Currency is Alive", `${CASE_STUDY}future-of-currency-is-alive`],
  [/files app/i, "iOS Files App Redesign", "https://www.behance.net/gallery/237448605/Files-App-Redesign"],
  [/garden lumi[eè]re/i, "Garden Lumière", `${CASE_STUDY}garden-lumiere`],
  [/two speeds/i, "Two Speeds of Bengaluru", `${CASE_STUDY}two-speeds-of-bengaluru`],
  [/systematic erasure/i, "Women and Systematic Erasure", `${CASE_STUDY}women-and-systematic-erasure`],
  [/rise of hip-?hop/i, "Rise of Hiphop", `${CASE_STUDY}rise-of-hiphop`],
  [/journey of trash/i, "Journey of Trash", `${CASE_STUDY}journey-of-trash`],
  [/world championship/i, "The Unofficial Official World Championship", `${CASE_STUDY}unofficial-world-cup`],
  [/spotify poster/i, "Spotify Poster Generator", `${CASE_STUDY}spotify-visualiser`],
  [/pehchaan|artisan id/i, "Artisan Pehchaan Card", `${CASE_STUDY}artisan-id-card-redesign`],
  [/digital delights|gigamap/i, "The Garden of Digital Delights", `${CASE_STUDY}system-design-gigamap`],
  [/cloutcart/i, "CloutCart", `${CASE_STUDY}business-management-zeus`],
  [/inventing analogies/i, "Inventing Analogies", `${CASE_STUDY}inventing-analogies`],
  [/impressions of care|kaagaz ki kashti/i, "Impressions of Care", `${CASE_STUDY}impressions-of-care`],
];

// The model often names projects without linking them, so add any missing links (max 4).
const addProjectLinks = (answer) => {
  const missing = projectLinks
    .filter(([pattern, , url]) => pattern.test(answer) && !answer.includes(url))
    .slice(0, 4)
    .map(([, name, url]) => `- ${name}: ${url}`);
  if (!missing.length) return answer;
  const endsWithLinks = /^- .+: https?:\/\/\S+$/.test(answer.trim().split("\n").pop());
  return `${answer.trimEnd()}${endsWithLinks ? "\n" : "\n\n"}${missing.join("\n")}`;
};

const parseModelOutput = (text) => {
  if (!text) {
    return {
      answer: "I do not have enough portfolio context to answer that confidently.",
      suggestions: defaultSuggestions,
    };
  }

  const jsonText =
    text.match(/```json\s*([\s\S]*?)```/i)?.[1] ||
    text.match(/```\s*([\s\S]*?)```/)?.[1] ||
    text;

  try {
    const parsed = JSON.parse(jsonText);
    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions
          .filter((suggestion) => typeof suggestion === "string")
          .map((suggestion) => suggestion.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

    return {
      answer:
        typeof parsed.answer === "string" && parsed.answer.trim()
          ? parsed.answer.trim()
          : text.trim(),
      suggestions: suggestions.length ? suggestions : defaultSuggestions,
    };
  } catch {
    return {
      answer: text.trim(),
      suggestions: defaultSuggestions,
    };
  }
};

const getSafeMessages = (messages = []) =>
  messages
    .filter(
      (message) =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_CHARS),
    }));

const logConversation = async ({
  request,
  clientId,
  model,
  messages,
  answer = "",
  suggestions = [],
  status = "success",
  error = "",
  startedAt,
}) => {
  const webhookUrl = process.env.KUL_LLM_LOG_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Kul LLM logging skipped: KUL_LLM_LOG_WEBHOOK_URL is not set.");
    return;
  }

  const safeMessages = getSafeMessages(messages);
  const latestQuestion =
    [...safeMessages].reverse().find((message) => message.role === "user")
      ?.content || "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOG_TIMEOUT_MS);

  try {
    const logResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        status,
        model,
        latestQuestion,
        answer,
        suggestions,
        messages: safeMessages,
        clientIdHash: hashValue(clientId),
        userAgent: request.headers["user-agent"] || "",
        durationMs: Date.now() - startedAt,
        error,
      }),
    });

    if (!logResponse.ok) {
      const responseText = await logResponse.text().catch(() => "");
      console.warn("Kul LLM logging failed:", {
        status: logResponse.status,
        statusText: logResponse.statusText,
        response: responseText.slice(0, 500),
      });
    }
  } catch (logError) {
    console.warn("Kul LLM logging failed:", logError?.message || logError);
    // Logging should never stop the chatbot from answering.
  } finally {
    clearTimeout(timeout);
  }
};

export default async function handler(request, response) {
  const startedAt = Date.now();
  setJsonHeaders(response);

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const clientId = getClientId(request);

  const apiKey =
    process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({
      error:
        "Missing GOOGLE_AI_STUDIO_API_KEY. Add your Google AI Studio key in the deployment environment.",
    });
  }

  if (!Array.isArray(request.body?.messages)) {
    return response.status(400).json({ error: "Messages must be an array." });
  }

  const messages = normalizeMessages(request.body.messages);

  if (!messages.length) {
    return response.status(400).json({ error: "A message is required." });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const sendRequest = () =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: messages,
          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            maxOutputTokens: 900,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                answer: { type: "STRING" },
                suggestions: { type: "ARRAY", items: { type: "STRING" } },
              },
              required: ["answer", "suggestions"],
            },
          },
        }),
      });

    let geminiResponse;
    try {
      geminiResponse = await sendRequest();
      // Gemini returns 503 during short demand spikes; one retry usually succeeds.
      if (geminiResponse.status === 503) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        geminiResponse = await sendRequest();
      }
    } finally {
      clearTimeout(timeout);
    }

    const data = await geminiResponse.json().catch(() => ({}));

    if (!geminiResponse.ok) {
      const status = geminiResponse.status >= 500 ? 502 : geminiResponse.status;
      const geminiError =
        data?.error?.message ||
        data?.error?.status ||
        "Gemini returned an unsuccessful response.";

      console.warn("Kul LLM Gemini request failed:", {
        status: geminiResponse.status,
        model,
        error: geminiError,
      });

      return response.status(status).json({
        error: "Kul LLM could not answer that request right now.",
      });
    }

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join("\n")
        .trim() || "";
    const parsedOutput = parseModelOutput(answer);
    parsedOutput.answer = addProjectLinks(parsedOutput.answer);

    await logConversation({
      request,
      clientId,
      model,
      messages: request.body.messages,
      answer: parsedOutput.answer,
      suggestions: parsedOutput.suggestions,
      startedAt,
    });

    return response.status(200).json({
      answer: parsedOutput.answer,
      suggestions: parsedOutput.suggestions,
    });
  } catch (error) {
    const status = error?.name === "AbortError" ? 504 : 500;
    await logConversation({
      request,
      clientId,
      model,
      messages: request.body.messages,
      status: "error",
      error: error?.name || "Unknown error",
      startedAt,
    });

    return response.status(status).json({
      error: "Kul LLM could not reach Gemini. Please try again shortly.",
    });
  }
}
