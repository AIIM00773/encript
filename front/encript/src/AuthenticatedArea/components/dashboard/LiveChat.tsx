import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Check, Copy, Lock, Send, Shuffle } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types & helpers                                                     */
/* ------------------------------------------------------------------ */

type Message = {
  id: string;
  from: "me" | "peer" | "system";
  text: string;
  at: number;
};

const adjectives = ["Quiet", "Amber", "Swift", "Calm", "Silver", "Bright", "Hidden", "Steady"];
const animals = ["Fox", "Heron", "Otter", "Lynx", "Falcon", "Panda", "Gecko", "Ibis"];

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const makeAlias = () => `${pick(adjectives)} ${pick(animals)}`;

const randomHex = (bytes: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const formatTime = (ms: number) =>
  new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A12]";

const card = "rounded-2xl border border-white/[0.08] bg-white/[0.025]";

/**
 * PLACEHOLDER TRANSPORT
 * Replace the local simulation below with:
 *  - a WebSocket relay that only forwards ciphertext
 *  - key agreement in the browser (WebCrypto ECDH), messages sealed with AES-256-GCM
 *  - the invite key kept in the URL fragment so it never reaches the server
 *  - the safety code derived from both parties' public keys
 */

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function LiveChat() {
  const [view, setView] = useState<"lobby" | "room">("lobby");
  const [role, setRole] = useState<"host" | "guest">("host");
  const [alias, setAlias] = useState(makeAlias);
  const [joinInput, setJoinInput] = useState("");
  const [joinError, setJoinError] = useState("");

  const [roomId, setRoomId] = useState("");
  const [peer, setPeer] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  const inviteLink = roomId ? `https://encript.app/chat/${roomId}#${randomHexStable(roomId)}` : "";
  const safetyCode = roomId ? (roomId.slice(0, 8).toUpperCase().match(/.{4}/g) ?? []).join(" ") : "";

  const push = (from: Message["from"], text: string) =>
    setMessages((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, from, text, at: Date.now() }]);

  // Demo only: a peer joins a hosted room after a moment.
  useEffect(() => {
    if (view !== "room" || role !== "host" || peer) return;
    const t = window.setTimeout(() => {
      const name = makeAlias();
      setPeer(name);
      push("system", `${name} joined. Messages are now end-to-end encrypted.`);
      push("peer", "Hi, I'm here.");
    }, 2500);
    return () => window.clearTimeout(t);
  }, [view, role, peer]);

  // Keep the newest message in view.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const startChat = () => {
    setRole("host");
    setRoomId(randomHex(8));
    setPeer(null);
    setMessages([]);
    setView("room");
  };

  const joinChat = (e: FormEvent) => {
    e.preventDefault();
    const value = joinInput.trim();
    if (value.length < 6) {
      setJoinError("Paste the full invite link you were sent.");
      return;
    }
    setJoinError("");
    setRole("guest");
    setRoomId(randomHex(8));
    const name = makeAlias();
    setPeer(name);
    setMessages([
      { id: "s1", from: "system", text: `Connected with ${name}. Messages are end-to-end encrypted.`, at: Date.now() },
    ]);
    setView("room");
  };

  const send = () => {
    const text = draft.trim();
    if (!text || !peer) return;
    push("me", text);
    setDraft("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link stays selectable in the field.
    }
  };

  const endChat = () => {
    setView("lobby");
    setRoomId("");
    setPeer(null);
    setMessages([]);
    setDraft("");
    setConfirmEnd(false);
    setAlias(makeAlias());
  };

  /* ----------------------------- Lobby ----------------------------- */
  if (view === "lobby") {
    return (
      <section aria-label="Live chat" className="mx-auto max-w-3xl space-y-5">
        <p className="max-w-lg text-sm leading-6 text-slate-400">
          Talk privately without an account. Messages are encrypted on your device, and you appear under a random
          alias that changes with every chat.
        </p>

        <div className={`flex items-center justify-between gap-4 px-5 py-4 ${card}`}>
          <p className="text-sm text-slate-400">
            You will appear as <span className="font-medium text-slate-100">{alias}</span>
          </p>
          <button
            type="button"
            onClick={() => setAlias(makeAlias())}
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] ${focus}`}
          >
            <Shuffle size={14} />
            New alias
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className={`flex flex-col p-6 ${card}`}>
            <h2 className="text-base font-semibold text-white">Start a chat</h2>
            <p className="mt-1 flex-1 text-sm leading-6 text-slate-500">
              Create a private room and share the invite link with one person.
            </p>
            <button
              type="button"
              onClick={startChat}
              className={`mt-5 self-start rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 ${focus}`}
            >
              Create room
            </button>
          </div>

          <form onSubmit={joinChat} noValidate className={`flex flex-col p-6 ${card}`}>
            <h2 className="text-base font-semibold text-white">Join a chat</h2>
            <label htmlFor="invite" className="mt-1 text-sm text-slate-500">
              Paste the invite link you were sent.
            </label>
            <input
              id="invite"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              placeholder="https://encript.app/chat/…"
              autoComplete="off"
              aria-invalid={Boolean(joinError)}
              aria-describedby={joinError ? "invite-error" : undefined}
              className={`mt-3 w-full rounded-full border bg-black/20 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 ${focus} ${
                joinError ? "border-red-400/60" : "border-white/10"
              }`}
            />
            {joinError && (
              <p id="invite-error" role="alert" className="mt-2 text-sm text-red-300">
                {joinError}
              </p>
            )}
            <button
              type="submit"
              className={`mt-4 self-start rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.05] ${focus}`}
            >
              Join chat
            </button>
          </form>
        </div>
      </section>
    );
  }

  /* ------------------------------ Room ----------------------------- */
  return (
    <section aria-label="Live chat room" className={`mx-auto flex h-[calc(100vh-170px)] min-h-[480px] max-w-3xl flex-col overflow-hidden ${card}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-100">
            <span className={`h-2 w-2 rounded-full ${peer ? "bg-emerald-400" : "bg-amber-400"}`} />
            {peer ? `Chatting with ${peer}` : "Waiting for someone to join"}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Lock size={12} className="text-emerald-400" />
            End-to-end encrypted, you are {alias}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {confirmEnd ? (
            <>
              <button
                type="button"
                onClick={endChat}
                className={`rounded-full bg-red-500/15 px-3.5 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25 ${focus}`}
              >
                End chat
              </button>
              <button
                type="button"
                onClick={() => setConfirmEnd(false)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white ${focus}`}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmEnd(true)}
              className={`rounded-full border border-white/10 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] ${focus}`}
            >
              End chat
            </button>
          )}
        </div>
      </div>

      {confirmEnd && (
        <p className="border-b border-white/[0.08] bg-red-500/[0.04] px-5 py-2.5 text-sm text-slate-400">
          Ending the chat clears every message from this device. This can't be undone.
        </p>
      )}

      {/* Safety code, once connected */}
      {peer && (
        <p className="border-b border-white/[0.08] px-5 py-2.5 text-xs leading-5 text-slate-500">
          Safety code <span className="font-mono font-medium text-slate-300">{safetyCode}</span>. Ask {peer} to read
          theirs over another channel. If the codes match, nobody is listening in.
        </p>
      )}

      {/* Messages */}
      <div ref={logRef} role="log" aria-live="polite" aria-label="Messages" className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {!peer && (
          <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-slate-300">Share this invite link with one person. It only works for this chat.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={inviteLink}
                aria-label="Invite link"
                onFocus={(e) => e.currentTarget.select()}
                className={`min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200 ${focus}`}
              />
              <button
                type="button"
                onClick={copyInvite}
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 ${focus}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.from === "system" ? (
            <p key={m.id} className="py-1 text-center text-xs text-slate-500">
              {m.text}
            </p>
          ) : (
            <div key={m.id} className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}>
              <p
                className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-5 ${
                  m.from === "me" ? "rounded-br-md bg-indigo-500 text-white" : "rounded-bl-md bg-white/[0.07] text-slate-100"
                }`}
              >
                {m.text}
              </p>
              <span className="mt-1 px-1 text-xs tabular-nums text-slate-600">{formatTime(m.at)}</span>
            </div>
          ),
        )}
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-white/[0.08] p-3">
        <label htmlFor="chat-draft" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-draft"
          rows={1}
          maxLength={2000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!peer}
          placeholder={peer ? "Write a message" : "You can write once someone joins"}
          className={`max-h-32 min-h-[44px] flex-1 resize-none rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 disabled:opacity-50 ${focus}`}
        />
        <button
          type="submit"
          disabled={!peer || draft.trim() === ""}
          aria-label="Send message"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 ${focus}`}
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

/** Demo-only stand-in for the invite key. In production this is a real random key from WebCrypto. */
function randomHexStable(seed: string) {
  return seed.split("").reverse().join("") + seed.slice(0, 8);
}