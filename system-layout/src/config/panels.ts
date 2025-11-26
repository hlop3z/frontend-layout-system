export type PanelKind = 'red' | 'blue' | 'yellow' | 'green';

export interface PanelDefinition {
  readonly id: PanelKind;
  readonly title: string;
  readonly label: string;
  readonly description: string;
  readonly color: string;
}

export const panelDefinitions: readonly PanelDefinition[] = [
  {
    id: 'red',
    title: 'Red Panel',
    label: 'Red Panel',
    description: 'Primary workspace for high-priority tasks.',
    color: '#d32f2f',
  },
  {
    id: 'blue',
    title: 'Blue Panel',
    label: 'Blue Panel',
    description: 'Secondary workspace for contextual information.',
    color: '#1976d2',
  },
  {
    id: 'yellow',
    title: 'Yellow Panel',
    label: 'Yellow Panel',
    description: 'Shared space for metrics or alerts.',
    color: '#fbc02d',
  },
  {
    id: 'green',
    title: 'Green Panel',
    label: 'Green Panel',
    description: 'Utility area for tooling and experiments.',
    color: '#388e3c',
  },
] as const;

export const panelDefinitionMap: Record<PanelKind, PanelDefinition> = Object.fromEntries(
  panelDefinitions.map((panel) => [panel.id, panel]),
) as Record<PanelKind, PanelDefinition>;


