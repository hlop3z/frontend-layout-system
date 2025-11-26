import { useState, useCallback } from 'preact/hooks';
import type { JSX } from 'preact';
import { memo } from 'preact/compat';

interface HeaderProps {
  // Header doesn't need Golden Layout props
}

const MENU_ITEMS = ['File', 'Edit', 'Panels'] as const;

type MenuItem = (typeof MENU_ITEMS)[number];

const buttonBaseStyle: JSX.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#e0e0e0',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'background-color 0.15s ease',
} as const;

function Header(_props: HeaderProps) {
  const [hoveredButton, setHoveredButton] = useState<MenuItem | null>(null);

  const handleMouseEnter = useCallback((item: MenuItem) => {
    setHoveredButton(item);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredButton(null);
  }, []);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #404040',
        color: '#e0e0e0',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1 }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item}
              style={{
                ...buttonBaseStyle,
                backgroundColor: hoveredButton === item ? '#404040' : 'transparent',
              }}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              {item}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '6px 12px',
              backgroundColor: '#1e1e1e',
              border: '1px solid #404040',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '14px',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const HeaderComponent = memo(Header);
export { HeaderComponent as Header };

