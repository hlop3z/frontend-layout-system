import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { memo } from 'preact/compat';
import type { ComponentContainer, EventHub } from 'golden-layout';

export interface ColoredPanelProps {
  readonly label: string;
  readonly color: string;
  readonly glContainer?: ComponentContainer;
  readonly glEventHub?: EventHub;
}

function ColoredPanel({ label, color, glContainer }: ColoredPanelProps) {
  const containerStyle: JSX.CSSProperties = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      backgroundColor: color,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '24px',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      boxSizing: 'border-box',
      padding: '20px',
    }),
    [color]
  );

  const infoBoxStyle: JSX.CSSProperties = useMemo(
    () => ({
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      marginTop: '16px',
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '32px' }}>{label}</h2>
      {glContainer && (
        <div style={infoBoxStyle}>
          <p style={{ margin: '4px 0' }}>Container ID: {glContainer.componentType}</p>
          <p style={{ margin: '4px 0' }}>Width: {glContainer.width}px</p>
          <p style={{ margin: '4px 0' }}>Height: {glContainer.height}px</p>
        </div>
      )}
    </div>
  );
}

export { ColoredPanel };
export const ColoredPanelComponent = memo(ColoredPanel);

