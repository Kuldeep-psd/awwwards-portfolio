# 🌐 3D Awwwards-Level Developer Portfolio

### Built with React, GSAP, Three.js, TailwindCSS

This is a fully animated, interactive, 3D developer portfolio designed to **impress clients, recruiters, and hiring managers**. It's more than a portfolio—it's a web experience built with production-level code, scroll-based animations, and real-world best practices.

> ⚡ Inspired by Awwwards-level sites — built with React (Vite), TailwindCSS, GSAP, React Three Fiber, and Drei.

<br/>
<div>
  <img src="https://github.com/user-attachments/assets/4eaf9399-fd02-4a90-83f7-2b5a361bc032" alt="Hero" style="border-radius: 8px;"/>
  <div style="display: flex; justify-content: space-between; margin: 20px 0;">
    <img src="https://github.com/user-attachments/assets/155bf742-b24f-4119-89f4-87e6d88c8f53" alt="Works" style="width: 32%; border-radius: 8px;"/>
    <img src="https://github.com/user-attachments/assets/f22b9749-85ed-434f-a5f6-df1f8e221103" alt="ContactSummary" style="width: 32%; border-radius: 8px;"/>
    <img src="https://github.com/user-attachments/assets/3e473322-b96a-433b-aec5-ece9bab25795" alt="Contact" style="width: 32%; border-radius: 8px;"/>
  </div>
</div>
<br/>

> 📺 [Watch Full YouTube Walkthrough](https://youtu.be/i0229UsdBwc)
---

## 🚀 Tech Stack

| Technology       | Description                             |
| ---------------- | --------------------------------------- |
| **React (Vite)** | Fast dev server and production bundling |
| **Tailwind CSS** | Utility-first styling for components    |
| **GSAP**         | Scroll-based animation and motion logic |
| **Three.js**     | 3D scenes powered by React Three Fiber  |
| **Drei**         | Useful helpers for 3D rendering         |

---

## 📁 Features

- 🔥 3D Hero Section with animated planet and golden ring
- 🧩 Smooth slide-in Navbar with staggered link animations
- 🎯 Scroll-triggered Service Summary with horizontal word motion
- 🖼️ Works section with hover overlays and interactive previews
- ✍️ About section with clip-path image reveal + typewriter text
- 🏁 Marquee-based Contact Summary and CTA
- 💼 Fully responsive and accessible on all screen sizes

---

## 📦 Setup & Installation

```bash
git clone https://github.com/Ali-Sanati/awwwards-portfolio.git
cd awwwards-portfolio
npm install
npm run dev
```

> Open http://localhost:5173 in your browser.

## Kul LLM Setup

Kul LLM uses a serverless API route at `/api/kul-llm` so the Gemini key never ships to the browser.

For local serverless testing, create `.env.local`:

```bash
GOOGLE_AI_STUDIO_API_KEY=your_google_ai_studio_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
KUL_LLM_LOG_WEBHOOK_URL=your_google_apps_script_web_app_url
```

For production, add the same variables in your deployment provider's environment settings. On Vercel, add `GOOGLE_AI_STUDIO_API_KEY` and redeploy.

`KUL_LLM_LOG_WEBHOOK_URL` is optional. When it is present, each Kul LLM exchange is logged to that webhook.

### Google Sheets logging

1. Create a Google Sheet with this header row:

```text
Timestamp | Status | Model | Question | Answer | Suggestions | Messages | Client | User Agent | Duration | Error
```

2. In the sheet, go to Extensions > Apps Script and paste:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.status || "",
    data.model || "",
    data.latestQuestion || "",
    data.answer || "",
    JSON.stringify(data.suggestions || []),
    JSON.stringify(data.messages || []),
    data.clientIdHash || "",
    data.userAgent || "",
    data.durationMs || "",
    data.error || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function testLog() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        status: "test",
        model: "gemini-2.5-flash-lite",
        latestQuestion: "Test question",
        answer: "Test answer",
        suggestions: ["Test suggestion"],
        messages: [{ role: "user", content: "Test question" }],
        clientIdHash: "test-client",
        userAgent: "Apps Script manual test",
        durationMs: 123,
        error: "",
      }),
    },
  };

  doPost(mockEvent);
}
```

3. To test inside Apps Script, run `testLog`, not `doPost`. Running `doPost` directly will fail because Apps Script only provides `postData` for real webhook requests.

4. Deploy it as a Web app:
   - Execute as: Me
   - Who has access: Anyone

5. Copy the Web app URL and set it as `KUL_LLM_LOG_WEBHOOK_URL` in `.env.local` and in Vercel.

---

## 🛠️ Customization Tips

- Change text, images, and links in /constants/index.js

- Update 3D models and scene in Hero.jsx

- Add your own contact info in Contact.jsx

- Adjust colors, fonts, and layout via tailwind.config.js

---

## 🔗 Assets

Assets used in the project can be found [here](https://github.com/user-attachments/files/19820923/public.zip)

---

## 📣 Like the project?

If this helped you build or inspire your own site:

- ⭐ Star this repo

- 📺 [Watch the full walkthrough on YouTube](https://youtu.be/i0229UsdBwc)

- 📬 [Connect on LinkedIn](https://www.linkedin.com/in/ali-sanati)

- 📷 [Follow me on Instagram](https://www.instagram.com/ali.sanatidev/reels/)

---

## 🤝 Let’s Build Together

Drop a comment on the video or open an issue with your idea!

> 📩 Like, subscribe, and let me know what kind of project you want to build together!
