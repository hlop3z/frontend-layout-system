import { useMemo, useCallback } from 'preact/hooks';
import type { JSX, TargetedEvent } from 'preact';
import { memo } from 'preact/compat';
import { emitCommand } from '../signals/commandBus';

interface RightSidebarProps {
  // RightSidebar doesn't need Golden Layout props currently
}

const THEME_OPTIONS = ['Dark', 'Light', 'Auto'] as const;
const LAYOUT_OPTIONS = ['Docked', 'Floating', 'Tabbed'] as const;

const selectStyle: JSX.CSSProperties = {
  width: '100%',
  padding: '6px',
  backgroundColor: '#1e1e1e',
  border: '1px solid #404040',
  borderRadius: '4px',
  color: '#cccccc',
  fontSize: '12px',
} as const;

function RightSidebar(_props: RightSidebarProps) {
  const containerStyle: JSX.CSSProperties = useMemo(
    () => ({
      height: '100%',
      width: '100%',
      backgroundColor: '#252526',
      color: '#cccccc',
      padding: '16px',
      fontSize: '13px',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderLeft: '1px solid #3e3e42',
      boxSizing: 'border-box',
    }),
    []
  );

  const handleThemeChange = useCallback((event: TargetedEvent<HTMLSelectElement>) => {
    emitCommand('properties.theme-change', 'Change Panel Theme', 'properties.action', { theme: event.currentTarget.value });
  }, []);

  const handleLayoutModeChange = useCallback((event: TargetedEvent<HTMLSelectElement>) => {
    emitCommand('properties.layout-mode-change', 'Change Layout Mode', 'properties.action', {
      mode: event.currentTarget.value,
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '16px' }}>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#e0e0e0',
          }}
        >
          Properties
        </h3>
        <div style={{ color: '#858585', fontSize: '12px' }}>
          Panel properties and settings
        </div>
      </div>
      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '12px',
              color: '#858585',
            }}
          >
            Panel Theme
          </label>
          <select style={selectStyle} onChange={handleThemeChange}>
            {THEME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '12px',
              color: '#858585',
            }}
          >
            Layout Mode
          </label>
          <select style={selectStyle} onChange={handleLayoutModeChange}>
            {LAYOUT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export const RightSidebarComponent = memo(RightSidebar);
export { RightSidebarComponent as RightSidebar };

