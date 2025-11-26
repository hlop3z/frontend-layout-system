import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import type { EventHub } from 'golden-layout';
import { CommandPalette } from './CommandPalette';
import type { CommandPaletteSection } from './CommandPalette';
import { panelDefinitions } from '../config/panels';
import { emitCommand } from '../signals/commandBus';

interface LeftSidebarProps {
  glEventHub?: EventHub;
}

function LeftSidebar({ glEventHub }: LeftSidebarProps) {
  const sections = useMemo<CommandPaletteSection[]>(() => {
    const panelSection: CommandPaletteSection = {
      id: 'panels',
      title: 'Panels',
      items: panelDefinitions.map((panel) => ({
        id: `panel-${panel.id}`,
        label: panel.label,
        description: panel.description,
        accentColor: panel.color,
        draggable: true,
        command: {
          type: 'palette:add-panel',
          payload: { panelId: panel.id },
        },
      })),
    };

    const fileSection: CommandPaletteSection = {
      id: 'file',
      title: 'File',
      items: [
        { id: 'file-close', label: 'Close', command: { type: 'file:close' }, description: 'Close the active document.' },
        {
          id: 'file-close-tab',
          label: 'Close Tab',
          command: { type: 'file:close-tab' },
          description: 'Close the current tab',
        },
        {
          id: 'file-new-tab',
          label: 'New Tab',
          command: { type: 'file:new-tab' },
          description: 'Open a new tab',
        },
        {
          id: 'file-save-on-exit',
          label: 'Save on Exit',
          command: { type: 'file:save-on-exit-toggle' },
          description: 'Toggle the save on exit flag',
        },
        { id: 'file-task-manager', label: 'Task Manager', command: { type: 'file:task-manager' } },
      ],
    };

    const editSection: CommandPaletteSection = {
      id: 'edit',
      title: 'Edit',
      items: [
        { id: 'edit-copy', label: 'Copy File', command: { type: 'edit:copy-file' } },
        { id: 'edit-cut', label: 'Cut', command: { type: 'edit:cut' } },
        { id: 'edit-paste', label: 'Paste', command: { type: 'edit:paste' } },
      ],
    };

    return [editSection, fileSection, panelSection];
  }, []);

  return (
    <CommandPalette
      sections={sections}
      onExecute={(command, source) => {
        glEventHub?.emitUserBroadcast('command-palette:command', {
          command,
          source,
        });
        emitCommand(command.type, command.payload, source);
      }}
    />
  );
}

export const LeftSidebarComponent = memo(LeftSidebar);
export { LeftSidebarComponent as LeftSidebar };

