import { memo } from 'preact/compat';
import { useMemo, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import { emitCommand, type CommandSource } from '../signals/commandBus';

export interface PaletteCommand {
  readonly type: string;
  readonly payload?: Record<string, unknown>;
}

export interface CommandPaletteItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly command: PaletteCommand;
  readonly accentColor?: string;
  readonly draggable?: boolean;
}

export interface CommandPaletteSection {
  readonly id: string;
  readonly title: string;
  readonly items: readonly CommandPaletteItem[];
}

interface CommandPaletteProps {
  readonly sections: readonly CommandPaletteSection[];
  readonly onExecute?: (command: PaletteCommand, source: CommandSource) => void;
}

const toggleDragCursor = (isActive: boolean) => {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('command-drag-active', isActive);
};

function CommandPalette({ sections, onExecute }: CommandPaletteProps) {
  const draggingItemRef = useRef<CommandPaletteItem | null>(null);

  const containerStyle = useMemo<JSX.CSSProperties>(
    () => ({
      height: '100%',
      width: '100%',
      backgroundColor: '#252526',
      color: '#cccccc',
      overflowY: 'auto',
      overflowX: 'hidden',
      fontSize: '13px',
      borderRight: '1px solid #3e3e42',
    }),
    [],
  );

  const triggerCommand = (item: CommandPaletteItem, source: CommandSource) => {
    const commandHandler = onExecute ?? ((command, commandSource) => emitCommand(command.type, command.payload, commandSource));
    commandHandler(item.command, source);
  };

  return (
    <div style={containerStyle}>
      <div style={{ padding: '8px 0' }}>
        {sections.map((section, sectionIndex) => (
          <div key={section.id}>
            <div
              style={{
                padding: '4px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#858585',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: sectionIndex > 0 ? '16px' : '0',
              }}
            >
              {section.title}
            </div>
            {section.items.map((item) => (
              <div
                key={item.id}
                draggable={item.draggable}
                onDragStart={(event) => {
                  const dataTransfer = event.dataTransfer;
                  if (!dataTransfer) return;

                  dataTransfer.setData('application/x-command', JSON.stringify(item.command));
                  dataTransfer.setData('text/plain', item.label);
                  dataTransfer.effectAllowed = 'copy';
                  draggingItemRef.current = item;
                  toggleDragCursor(true);
                }}
                onDragEnd={() => {
                  if (draggingItemRef.current?.id === item.id) {
                    draggingItemRef.current = null;
                  }
                  toggleDragCursor(false);
                }}
                onDblClick={() => triggerCommand(item, 'click')}
                style={{
                  padding: '6px 16px',
                  cursor: item.draggable ? 'grab' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = '#2a2d2e';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.accentColor && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.accentColor,
                        boxShadow: `0 0 6px ${item.accentColor}`,
                      }}
                    />
                  )}
                  <span style={{ color: '#f0f0f0', fontWeight: 500 }}>{item.label}</span>
                </div>
                {item.description && (
                  <span style={{ fontSize: '11px', color: '#858585' }}>{item.description}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const CommandPaletteComponent = memo(CommandPalette);
export { CommandPaletteComponent as CommandPalette };


