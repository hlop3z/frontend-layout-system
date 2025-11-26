import { signal } from '@preact/signals';

export type CommandSource = 'click' | 'drag' | 'shortcut' | 'programmatic';

export type CommandPayload = Record<string, unknown> | undefined;

export interface CommandEvent<TPayload = CommandPayload> {
  readonly id: string;
  readonly type: string;
  readonly payload: TPayload;
  readonly source: CommandSource;
  readonly timestamp: number;
}

const generateCommandId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `cmd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const latestCommand = signal<CommandEvent | null>(null);
export const commandHistory = signal<CommandEvent[]>([]);

export function emitCommand<TPayload extends CommandPayload = CommandPayload>(
  type: string,
  payload?: TPayload,
  source: CommandSource = 'click',
): CommandEvent<TPayload> {
  const event: CommandEvent<TPayload> = {
    id: generateCommandId(),
    type,
    payload: (payload ?? undefined) as TPayload,
    source,
    timestamp: Date.now(),
  };

  commandHistory.value = [...commandHistory.value.slice(-99), event];
  latestCommand.value = event;

  return event;
}


