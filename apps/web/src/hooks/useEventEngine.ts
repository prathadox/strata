'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EVENT_TEMPLATES,
  makeEvent,
  seedEvents,
  type AgentEvent,
  type AgentKey
} from '@/lib/appData';
import { AGENTS } from '@/lib/onchain';

interface AgentStatus {
  status: 'working' | 'idle';
  doing: string;
}

export function useEventEngine(onEmit?: (e: AgentEvent) => void) {
  const [events, setEvents] = useState<AgentEvent[]>(() => seedEvents());
  const [statuses, setStatuses] = useState<Record<AgentKey, AgentStatus>>(() => {
    const o: Record<string, AgentStatus> = {};
    AGENTS.forEach((a) => { o[a.key] = { status: a.status, doing: a.doing }; });
    return o as Record<AgentKey, AgentStatus>;
  });

  const onEmitRef = useRef(onEmit);
  useEffect(() => { onEmitRef.current = onEmit; }, [onEmit]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let settleTimer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const tpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const e = makeEvent(tpl);
      setEvents((prev) => [e, ...prev].slice(0, 60));
      setStatuses((prev) => ({ ...prev, [e.agentKey]: { status: 'working', doing: e.doing } }));
      onEmitRef.current?.(e);
      settleTimer = setTimeout(() => {
        setStatuses((prev) => {
          const a = AGENTS.find((x) => x.key === e.agentKey);
          const stayWorking = e.agentKey === 'scout' || e.agentKey === 'sentinel';
          return {
            ...prev,
            [e.agentKey]: { status: stayWorking ? 'working' : 'idle', doing: a?.doing ?? prev[e.agentKey].doing }
          };
        });
      }, 3200);
      timer = setTimeout(tick, 3500 + Math.random() * 3500);
    };
    timer = setTimeout(tick, 2600);
    return () => { clearTimeout(timer); clearTimeout(settleTimer); };
  }, []);

  const reset = useCallback(() => {
    setEvents(seedEvents());
  }, []);

  return { events, statuses, reset };
}
