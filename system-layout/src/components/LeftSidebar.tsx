import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";
import type { EventHub } from "golden-layout";
import {
  CommandPalette,
  type CommandPaletteProps,
  type CommandPaletteSection,
} from "./CommandPalette";
import { panelDefinitions } from "../config/panels";
import { emitCommand } from "../signals/commandBus";

interface LeftSidebarProps {
  glEventHub?: EventHub;
}

const SIDEBAR_SECTIONS: readonly CommandPaletteSection[] = [
  {
    id: "edit",
    title: "Edit",
    items: [
      {
        id: "edit-copy",
        label: "Copy File",
        command: {
          name: "edit.copy-file",
          label: "Copy File",
          type: "edit.action",
        },
        activation: "click",
      },
      {
        id: "edit-cut",
        label: "Cut",
        command: { name: "edit.cut", label: "Cut", type: "edit.action" },
        activation: "click",
      },
      {
        id: "edit-paste",
        label: "Paste",
        command: { name: "edit.paste", label: "Paste", type: "edit.action" },
        activation: "click",
      },
    ],
  },
  {
    id: "file",
    title: "File",
    items: [
      {
        id: "file-close",
        label: "Close",
        command: { name: "file.close", label: "Close", type: "file.action" },
        description: "Close the active document.",
        activation: "click",
      },
      {
        id: "file-close-tab",
        label: "Close Tab",
        command: {
          name: "file.close-tab",
          label: "Close Tab",
          type: "file.action",
        },
        description: "Close the current tab",
        activation: "click",
      },
      {
        id: "file-new-tab",
        label: "New Tab",
        command: {
          name: "file.new-tab",
          label: "New Tab",
          type: "file.action",
        },
        description: "Open a new tab",
        activation: "click",
      },
      {
        id: "file-save-on-exit",
        label: "Save on Exit",
        command: {
          name: "file.save-on-exit-toggle",
          label: "Save on Exit",
          type: "file.action",
        },
        description: "Toggle the save on exit flag",
        activation: "click",
      },
      {
        id: "file-task-manager",
        label: "Task Manager",
        command: {
          name: "file.task-manager",
          label: "Task Manager",
          type: "file.action",
        },
        activation: "click",
      },
    ],
  },
  {
    id: "panels",
    title: "Panels",
    items: panelDefinitions.map((panel) => ({
      id: `panel-${panel.id}`,
      label: panel.label,
      description: panel.description,
      accentColor: panel.color,
      draggable: true,
      command: {
        name: "palette.add-panel",
        label: panel.label,
        type: "palette.panel",
        payload: { panelId: panel.id },
      },
    })),
  },
] as const;

function LeftSidebar({ glEventHub }: LeftSidebarProps) {
  const handleExecute = useCallback<
    NonNullable<CommandPaletteProps["onExecute"]>
  >(
    (command, source) => {
      glEventHub?.emitUserBroadcast("command-palette:command", {
        command,
        source,
      });
      emitCommand(
        command.name,
        command.label,
        command.type,
        command.payload,
        source
      );
    },
    [glEventHub]
  );

  return (
    <CommandPalette sections={SIDEBAR_SECTIONS} onExecute={handleExecute} />
  );
}

export const LeftSidebarComponent = memo(LeftSidebar);
export { LeftSidebarComponent as LeftSidebar };
