import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import gsap from "gsap";

const starterQuestions = [
  "What projects have you worked on?",
  "Tell me about your design process",
  "What is your experience at Deloitte?",
];

const initialMessages = [
  {
    role: "assistant",
    content:
      "Hi, I am Kul LLM. Ask me about Kuldeep's work, projects, background, or how to get in touch.",
  },
];

const MessageText = ({ content, light = false }) => {
  const lines = content.split("\n").filter(Boolean);

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const isListItem = /^[-*]\s+/.test(line.trim());
        const cleanLine = line.replace(/^[-*]\s+/, "");

        return (
          <p
            key={`${line}-${index}`}
            className={isListItem ? "pl-4 before:content-['•'] before:mr-2" : ""}
          >
            {cleanLine.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong
                  key={partIndex}
                  className={`font-semibold ${
                    light ? "text-white" : "text-black"
                  }`} 
                >
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={partIndex}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
};

const LoadingMessage = () => (
  <div className="space-y-3" aria-live="polite" aria-label="Kul LLM is replying">
    <p className="text-[10px] font-light uppercase tracking-[0.32em] text-white/30">
      Kul LLM
    </p>
    <div className="kul-llm-thinking relative grid h-10 w-20 place-items-center overflow-hidden border border-white/12">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="kul-llm-thinking-dot" />
        <span className="kul-llm-thinking-dot" />
        <span className="kul-llm-thinking-dot" />
      </div>
    </div>
  </div>
);

const KulLLM = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState(starterQuestions);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const formRef = useRef(null);
  const timelineRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    gsap.set(panelRef.current, { xPercent: 100 });
    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set([headerRef.current, bodyRef.current, formRef.current], {
      clearProps: "transform",
      x: 0,
    });
    gsap.set([headerRef.current, bodyRef.current, formRef.current], {
      autoAlpha: 0,
    });

    timelineRef.current = gsap
      .timeline({ paused: true })
      .to(
        overlayRef.current,
        {
          autoAlpha: 1,
          duration: 0.18,
          ease: "power2.out",
        },
        0
      )
      .to(
        panelRef.current,
        {
          xPercent: 0,
          duration: 0.72,
          ease: "power4.out",
        },
        0
      )
      .to(
        [headerRef.current, bodyRef.current, formRef.current],
        {
          autoAlpha: 1,
          x: 0,
          clearProps: "transform",
          stagger: 0.08,
          duration: 0.34,
          ease: "power2.out",
        },
        "<+0.04"
      );

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const resetChat = () => {
    setMessages(initialMessages);
    setInput("");
    setError("");
    setSuggestions(starterQuestions);
  };

  const askQuestion = async (question) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    const nextMessages = [
      ...messages,
      { role: "user", content: trimmedQuestion },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setSuggestions([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/kul-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Kul LLM is unavailable right now.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            data.answer ||
            "I could not find a confident answer in Kuldeep's portfolio context.",
        },
      ]);
      setSuggestions(
        Array.isArray(data.suggestions) && data.suggestions.length
          ? data.suggestions.slice(0, 3)
          : starterQuestions
      );
    } catch (err) {
      setError(err.message);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            "I am having trouble reaching the model right now. Please try again in a moment.",
        },
      ]);
      setSuggestions(starterQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion(input);
  };

  const openPanel = () => {
    setIsOpen(true);
    setIsInfoOpen(false);
    timelineRef.current?.timeScale(1.85).play();
  };

  const closePanel = () => {
    timelineRef.current?.timeScale(0.72).reverse();
    setIsOpen(false);
    setIsInfoOpen(false);
  };

  const keepScrollInPanel = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <button
        type="button"
        onClick={openPanel}
        aria-label="Open Kul LLM"
        className={`fixed right-6 bottom-6 z-40 inline-flex items-center gap-3 rounded-full border border-black bg-black px-5 py-4 text-sm font-medium uppercase tracking-widest text-white shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-DarkLava md:right-10 md:bottom-10 ${
          isOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Icon icon="lucide:circle-dot" className="size-5" />
        <span>Kul LLM</span>
      </button>

      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[60] bg-transparent ${
          isOpen ? "" : "pointer-events-none"
        }`}
        onClick={closePanel}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        onWheel={keepScrollInPanel}
        onTouchMove={keepScrollInPanel}
        className="fixed bottom-0 right-0 top-0 z-[70] grid h-dvh w-[420px] max-w-[100vw] grid-rows-[76px_minmax(0,1fr)_auto] overflow-hidden bg-black text-white shadow-2xl shadow-black/40"
        aria-label="Kul LLM chat panel"
      >
        <header
          ref={headerRef}
          className="flex min-w-0 items-center justify-between border-b border-white/10 px-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="text-xs font-light uppercase tracking-[0.38em] text-white/70">
              Kul LLM
            </h2>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsInfoOpen((current) => !current)}
                aria-label="About Kul LLM"
                aria-expanded={isInfoOpen}
                className="grid size-7 place-items-center text-white/45 transition-colors hover:text-white/80"
              >
                <Icon icon="lucide:info" className="size-5" />
              </button>
              {isInfoOpen && (
                <div className="absolute left-0 top-9 z-10 w-72 border border-white/15 bg-black p-4 text-xs leading-relaxed text-white/65 shadow-xl">
                  <p>
                    Kul LLM is an AI chatbot. May contain hallucinations.
                    Responses are logged for research and development purposes.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetChat}
              aria-label="Reset Kul LLM chat"
              className="grid size-9 place-items-center text-white/55 transition-colors hover:text-white"
            >
              <Icon icon="lucide:rotate-ccw" className="size-4" />
            </button>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close Kul LLM"
              className="grid size-9 place-items-center text-white/55 transition-colors hover:text-white"
            >
              <Icon icon="lucide:x" className="size-6 stroke-[1.4]" />
            </button>
          </div>
        </header>

        <div
          ref={bodyRef}
          className="kul-llm-scroll min-w-0 overscroll-contain overflow-y-auto overflow-x-hidden px-5 py-7"
        >
          {messages.length === 1 && (
            <div className="w-full">
              <p className="mb-3 text-[11px] font-light uppercase tracking-[0.34em] text-white/35">
                Portfolio assistant
              </p>
              <p className="mb-8 text-base font-light leading-relaxed text-white/62">
                Ask about Kuldeep's projects, process, background, or ways to
                connect.
              </p>
              <div className="flex w-full flex-col overflow-hidden border-y border-white/10">
                {suggestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => askQuestion(question)}
                    className="group flex w-full items-start gap-3 border-b border-white/10 py-4 text-left text-sm font-light leading-snug text-white/58 transition-colors last:border-b-0 hover:text-white"
                  >
                    <Icon
                      icon="lucide:corner-down-right"
                      className="mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-1"
                    />
                    <span className="min-w-0 flex-1 text-pretty">
                      {question}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 1 && (
            <div className="space-y-7">
              {messages.slice(1).map((message, index) => (
                <div key={`${message.role}-${index}`} className="space-y-3">
                  <p className="text-[10px] font-light uppercase tracking-[0.32em] text-white/30">
                    {message.role === "user" ? "You asked" : "Kul LLM"}
                  </p>
                  <div
                    className={`border text-sm font-light leading-relaxed ${
                      message.role === "user"
                        ? "border-white/20 px-4 py-3 text-white/70"
                        : "border-transparent py-1 text-white/72"
                    }`}
                  >
                    <MessageText
                      content={message.content}
                      light={message.role !== "user"}
                    />
                  </div>
                </div>
              ))}
              {isLoading && <LoadingMessage />}
              {error && (
                <p className="border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
              {!isLoading && suggestions.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <p className="mb-1 text-[10px] font-light uppercase tracking-[0.32em] text-white/30">
                    Ask next
                  </p>
                  {suggestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => askQuestion(question)}
                      className="group flex w-full items-start gap-3 py-3 text-left text-sm font-light leading-snug text-white/45 transition-colors hover:text-white"
                    >
                      <Icon
                        icon="lucide:corner-down-right"
                        className="mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-1"
                      />
                      <span className="min-w-0 flex-1 text-pretty">
                        {question}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="min-w-0 border-t border-white/10 bg-black p-5"
        >
          <div className="flex w-full items-center border border-white/20 bg-black">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Kuldeep..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base font-light text-white outline-none placeholder:text-white/35"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="grid size-12 shrink-0 place-items-center text-white/55 transition-colors hover:text-white disabled:text-white/20"
            >
              <Icon icon="lucide:arrow-up" className="size-5" />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default KulLLM;
