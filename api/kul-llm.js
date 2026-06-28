/* global process */

import crypto from "node:crypto";

const REQUEST_TIMEOUT_MS = 12 * 1000;
const LOG_TIMEOUT_MS = 2 * 1000;
const MAX_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 1200;

const portfolioContext = `
Kuldeep Singh is an Information Designer focused on turning complexity into intuitive and meaningful experiences across systems, data, and interfaces.

Positioning:
- Information Design, Data, Service Design, HCI, Storytelling, Data Visualization, and User Research.
- Kuldeep bridges complex data and human-centered experiences.
- His practice combines systems logic, creative technology, and user research to solve complex, human-centered problems.
- He enjoys untangling messy constraints and shaping them into digital experiences that feel intuitive, scalable, and honest.

Experience and education:
- Analyst / Customer Strategy & Design at Deloitte India LLP from Aug 2023 to May 2024. Collaborated with cross-functional teams on user research and design strategy. Contributed to experience design for enterprise clients, aligning user needs with business goals. Conducted market research and competitive benchmarking for client proposals. Created visual presentations and pitch decks to support new client engagements.
- Design Intern at Ideoholics Design Studio from Sep 2022 to Nov 2022. Designed end-to-end wireframes, prototypes, and high-fidelity interfaces for mobile and web products. Produced static and motion-based marketing assets for clients across sectors.
- M.Des in Information Design at National Institute of Design, Bengaluru from June 2024 to current.
- B.Tech in Computer Science at Delhi Technological University from Aug 2019 to July 2023.

Volunteering and leadership:
- Creative Coding Workshop: Facilitated a creative coding workshop for 25+ participants from diverse backgrounds. Introduced foundational p5.js concepts and guided attendees in using LLM code generation to prototype and execute concepts.
- D'Frost Website Lead: Led the development and deployment of the D'Frost annual festival website for 2026, focused on a fast, highly responsive, and interactive experience.

Recognition:
- DesignUp Futures Challenge Winner 2025. Speculative Design Challenge organised by futur2 studio, Berlin, with a jury of 10 design leaders worldwide. Presented the winning concept, "Future of Currency is Alive", to a live audience of 1,200+ attendees.

Tools and skills:
- UI Design, Data Visualisation, Adobe Creative Suite, Codex, Service Design, Scrollytelling, Observable Notebooks, Svelte, Systems Thinking, Motion Design, Mapbox GL JS, Python, User Research, Figma/FigJam, HTML/CSS/JS, p5.js.

Featured case studies:
- Rajgruha: Service Design. A centralized digital platform functioning as Digital Public Infrastructure for India's public library ecosystem. It modernizes library access, uncovers hidden physical resources, and improves utilization at scale. Tags: Service Design, Human Centred AI, Public Policy, User Research, Systems Thinking. Case study: https://www.behance.net/gallery/238402507/Public-Libraries-DPI-Service-Design
- iOS Files App Redesign. A UX redesign to reduce user frustration and dependence on workarounds. It reimagines Apple's mobile file management with stronger navigation and information architecture. Tags: UX/UI Design, Prototyping, User Research, Information Architecture, Double Diamond. Case study: https://www.behance.net/gallery/237448605/Files-App-Redesign
- Future of Currency is Alive. A speculative design project about alternative economic incentives and future-casting. It proposes a self-depreciating currency model that discourages hoarding and aligns value with sustainability. Award: DesignUp Futures Challenge Winner 2025. Tags: Speculative Design, Tangible DataViz, Worldbuilding, Storytelling, Critical Design. Project: https://petcoin.vercel.app/

More work:
- Women and Systematic Erasure - A Data Narrative. A scrollytelling project. Link: https://womenhistory.vercel.app/
- Form Redesign - Artisan Pehchaan Card. A UI/UX audit and form redesign. Link: https://www.behance.net/gallery/238402077/Form-Redesign
- Data Biopic - Ward Shelley. A data visualization project. Link: https://www.behance.net/gallery/238401869/Ward-Shelley-Data-Biopic
- Two Speeds of Bengaluru. A speculative analysis of Bengaluru's infrastructure: silicon speed vs physical gridlock. Framework: Metaphor Visualization. Link: https://bengaluru-pcb.vercel.app/

Interests:
- Reading or breaking apart ideas.
- Playing with data, visuals, and code.
- Solo traveling and finding quiet corners of new cities.
- Logging world cinema on Letterboxd.

Contact:
- Email: kuldeep_s@nid.edu
- Phone: +91 98187 21068
- LinkedIn: https://www.linkedin.com/in/kuldeep-singh-9818721068/
- Behance: https://www.behance.net/kuldeesingh
- Instagram: https://www.instagram.com/kuldeep._.s_/
- Letterboxd: https://letterboxd.com/Lettucefries/
- Resume: /resume/KuldeepSingh_Resume.pdf
`;

const systemInstruction = `
You are Kul LLM, a concise portfolio assistant for Kuldeep Singh's website.
Answer naturally and helpfully using only the portfolio context below.
Speak about Kuldeep in the third person unless the user explicitly asks you to draft copy as Kuldeep.
If the answer is not in the context, say you do not have that detail and suggest contacting Kuldeep.
Do not invent awards, employers, dates, metrics, clients, or project details.
Keep answers short, specific, and easy to scan. Use bullets when listing projects.
Return valid JSON only with this shape:
{
  "answer": "A concise markdown-like answer. Use short paragraphs or bullet lines.",
  "suggestions": ["One relevant follow-up question?", "Another relevant follow-up question?", "A third relevant follow-up question?"]
}
Suggestions must be natural next questions based on the user's latest question and your answer. Keep each under 80 characters.

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

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const geminiResponse = await fetch(endpoint, {
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
          maxOutputTokens: 650,
          responseMimeType: "application/json",
        },
      }),
    }).finally(() => clearTimeout(timeout));

    const data = await geminiResponse.json().catch(() => ({}));

    if (!geminiResponse.ok) {
      const status = geminiResponse.status >= 500 ? 502 : geminiResponse.status;
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
