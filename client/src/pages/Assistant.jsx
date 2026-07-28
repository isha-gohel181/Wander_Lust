import React, { useMemo, useState } from "react";
import { Bot, Sparkles, ArrowRight, Search, MapPin, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { assistantService } from "@/services/assistant";

const QUICK_PROMPTS = [
  "Show me a romantic villa near the beach under 20000 INR",
  "Find the best family stays with pool and kitchen",
  "Which properties are good for 6 guests in Goa?",
  "Help me choose between budget and premium stays",
];

// ---------------------------------------------------------------------------
// Lightweight markdown renderer – no extra packages needed
// ---------------------------------------------------------------------------
const renderMarkdown = (text) => {
  if (!text) return null;

  const lines = text.split(/\n/);
  const elements = [];
  let listItems = [];
  let listType = null; // 'ol' | 'ul'
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    elements.push(
      <Tag
        key={key++}
        className={`ml-4 space-y-1 ${
          listType === "ol" ? "list-decimal" : "list-disc"
        }`}
      >
        {listItems.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  };

  const renderInline = (str) => {
    // Bold + italic: ***text***, then **text**, then *text*, then `code`
    const parts = str.split(/(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*|`.+?`)/);
    return parts.map((part, i) => {
      if (/^\*\*\*.+\*\*\*$/.test(part)) {
        return <strong key={i}><em>{part.slice(3, -3)}</em></strong>;
      }
      if (/^\*\*.+\*\*$/.test(part)) {
        return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      if (/^\*.+\*$/.test(part)) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      if (/^`.+`$/.test(part)) {
        return <code key={i} className="rounded bg-orange-50 px-1 py-0.5 text-xs font-mono text-wanderlust-700">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  for (const line of lines) {
    // Numbered list: "1. item", "2. item" etc.
    const olMatch = line.match(/^\s*(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (listType !== "ol") { flushList(); listType = "ol"; }
      listItems.push(olMatch[2]);
      continue;
    }

    // Bullet list: "- item" or "* item"
    const ulMatch = line.match(/^\s*[-*]\s+(.+)/);
    if (ulMatch) {
      if (listType !== "ul") { flushList(); listType = "ul"; }
      listItems.push(ulMatch[1]);
      continue;
    }

    // Heading: "## Title"
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match) {
      flushList();
      elements.push(
        <p key={key++} className="mt-3 mb-1 font-bold text-gray-900 text-sm">
          {renderInline(h2Match[1])}
        </p>
      );
      continue;
    }

    // Blank line – flush list and add spacing
    if (line.trim() === "") {
      flushList();
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    // Regular paragraph line
    flushList();
    elements.push(
      <p key={key++} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  return <div className="space-y-1">{elements}</div>;
};

const Assistant = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I can help you find stays, explain filters, or answer booking questions using Wanderlust listings and FAQs.",
    },
  ]);
  const [sources, setSources] = useState([]);
  const [model, setModel] = useState("");

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  const submitQuery = async (value) => {
    const text = (value || query).trim();
    if (!text || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setQuery("");

    try {
      const data = await assistantService.ask(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "I could not generate an answer." },
      ]);
      setSources(data.sources || []);
      setModel(data.model || "");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.message || "Something went wrong while generating the response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-gray-50/60">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-wanderlust-600">
              <Sparkles className="h-3.5 w-3.5" />
              Travel Assistant
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Ask for stays, filters, or travel guidance in plain language.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              The assistant searches Wanderlust property data and booking FAQs to give grounded answers, property suggestions, and short next steps.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Bot className="h-4 w-4 text-wanderlust-500" />
              Powered by Gemini {model ? `· ${model}` : ""}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Answers are grounded in indexed properties and FAQ chunks.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden border-gray-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50/80 to-white">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                <Wand2 className="h-5 w-5 text-wanderlust-500" />
                Chat
              </CardTitle>
              <CardDescription>
                Use one prompt or try a suggestion below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="space-y-3 rounded-3xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        message.role === "user"
                          ? "bg-wanderlust-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {message.role === "assistant"
                        ? renderMarkdown(message.content)
                        : message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                      Thinking with Gemini...
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitQuery(prompt)}
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-gray-900"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="space-y-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                <label className="text-sm font-semibold text-gray-900">
                  Ask anything
                </label>
                <Textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="e.g. Show me the best villa in Goa for 4 guests under 15000 INR"
                  className="min-h-[110px] resize-none rounded-2xl border-gray-200 focus-visible:ring-wanderlust-200"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitQuery();
                    }
                  }}
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for a new line.
                  </p>
                  <Button
                    onClick={() => submitQuery()}
                    disabled={loading || !query.trim()}
                    className="rounded-full bg-wanderlust-500 px-6 text-white shadow-lg shadow-wanderlust-500/20 hover:bg-wanderlust-600"
                  >
                    {loading ? "Searching..." : "Ask Assistant"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-gray-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  How it works
                </CardTitle>
                <CardDescription>
                  Simple flow from question to grounded answer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <div className="flex gap-3 rounded-2xl bg-orange-50/70 p-3">
                  <Search className="mt-0.5 h-4 w-4 text-wanderlust-500" />
                  <p>
                    The system turns your question into an embedding and matches it with relevant property and FAQ chunks.
                  </p>
                </div>
                <div className="flex gap-3 rounded-2xl bg-gray-50 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-wanderlust-500" />
                  <p>
                    It then sends the top matches to Gemini so the answer stays grounded in Wanderlust data.
                  </p>
                </div>
                <div className="flex gap-3 rounded-2xl bg-orange-50/70 p-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-wanderlust-500" />
                  <p>
                    The response includes helpful recommendations and the sources it used.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Sources used
                </CardTitle>
                <CardDescription>
                  Retrieved context from properties and FAQs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sources.length === 0 && hasMessages ? (
                  <p className="text-sm text-gray-500">
                    Sources will appear here after your first question.
                  </p>
                ) : null}
                {sources.map((source) => {
                  const location = [source.metadata?.city, source.metadata?.state, source.metadata?.country]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <div
                      key={`${source.sourceType}-${source.id}`}
                      className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-gray-900">{source.title}</h4>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-wanderlust-600">
                          {source.sourceType}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {location || "General knowledge chunk"}
                      </p>
                      {source.metadata?.basePrice ? (
                        <p className="mt-1 text-sm text-gray-500">
                          Price: {source.metadata.currency || "INR"} {source.metadata.basePrice}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-gray-400">
                        Similarity: {source.similarity}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assistant;
