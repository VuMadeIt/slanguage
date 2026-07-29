'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { env } from '@/config/env';
import { gatePlaygroundMessage, TIERS } from '@/domain/entitlements';
import { track } from '@/services/analytics';
import type { PlaygroundMessage } from '@/services/ai/playground';
import { DEFAULT_CHARACTER } from '@/services/ai/playground';
import { useEntitlementsStore } from '@/stores/useEntitlementsStore';
import { useHydrated } from '@/stores/StoreHydrationProvider';
import { useJournalStore } from '@/stores/useJournalStore';

type ChatMessage = PlaygroundMessage & { id: string };

export default function PlaygroundPage() {
  const hydrated = useHydrated();
  const tier = useEntitlementsStore((state) => state.tier);
  const messagesUsed = useEntitlementsStore(
    (state) => state.playgroundMessagesUsedToday,
  );
  const consume = useEntitlementsStore((state) => state.consumePlaygroundMessage);
  const encounterMany = useJournalStore((state) => state.encounterMany);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "I'm Riley. Drop a situation — a text you're about to send, a word you're not sure about — and I'll tell you how it actually lands.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gate = gatePlaygroundMessage(tier, messagesUsed);
  const limit = TIERS[tier].playgroundMessagesPerDay;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (!gate.allowed) {
      track({
        name: 'gate_blocked',
        feature: 'playground',
        requiredTier: gate.requiredTier,
      });
      setError(gate.reason);
      return;
    }

    setError(null);
    setInput('');
    setLoading(true);

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const history = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content,
      }));
      const response = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const data = (await response.json()) as {
        content?: string;
        slangTermIds?: string[];
        error?: string;
      };

      if (!response.ok) throw new Error(data.error ?? 'Request failed');

      consume();
      track({
        name: 'playground_message_sent',
        provider: env.aiProvider,
        characterId: DEFAULT_CHARACTER.id,
      });

      if (data.slangTermIds?.length) {
        encounterMany(data.slangTermIds, { source: 'playground' });
        data.slangTermIds.forEach((termId) =>
          track({ name: 'slang_encountered', termId }),
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.content ?? '…',
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Comms"
        title="Hail Riley"
        subtitle={DEFAULT_CHARACTER.vibe}
        action={
          hydrated && limit !== null ? (
            <Badge tone={gate.allowed ? 'muted' : 'solar'}>
              {messagesUsed}/{limit} today
            </Badge>
          ) : null
        }
      />

      <Card className="mt-6 flex max-h-[52dvh] min-h-[280px] flex-col overflow-hidden p-0">
        <ul className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className={
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }
            >
              <div
                className={
                  message.role === 'user'
                    ? 'max-w-[85%] rounded-2xl rounded-br-md bg-plasma-500 px-3.5 py-2.5 text-sm font-medium text-void-950'
                    : 'max-w-[85%] rounded-2xl rounded-bl-md bg-void-700 px-3.5 py-2.5 text-sm leading-relaxed text-white/90'
                }
              >
                {message.content}
              </div>
            </li>
          ))}
          {loading ? (
            <li className="text-sm text-white/40">Riley is typing…</li>
          ) : null}
        </ul>

        <form
          className="flex gap-2 border-t border-white/8 p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about a word or a situation…"
            disabled={loading || !gate.allowed}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-void-900 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-plasma-500/50 focus:outline-none"
          />
          <Button type="submit" disabled={loading || !input.trim() || !gate.allowed}>
            <Send size={16} aria-hidden />
          </Button>
        </form>
      </Card>

      {error ? <p className="mt-3 text-sm text-nebula-500">{error}</p> : null}

      {!gate.allowed ? (
        <EmptyState
          className="mt-6"
          emoji="🔒"
          title="Daily limit reached"
          body="Upgrade to Plus for unlimited Playground messages. Flip your tier on the Profile screen to demo it."
        />
      ) : null}

      <p className="mt-6 text-xs text-white/35">
        Provider: {env.aiProvider === 'claude' && hasAnthropicHint() ? 'Claude (via API route)' : 'Mock (offline)'}
        {' · '}
        Voice practice ships on Pro.
      </p>
    </AppShell>
  );
}

function hasAnthropicHint(): boolean {
  return env.aiProvider === 'claude';
}
