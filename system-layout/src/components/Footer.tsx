import { memo } from 'preact/compat';

interface FooterProps {
  // Footer doesn't need Golden Layout props
}

const STATUS_ITEMS = ['Ready', 'TypeScript', 'Preact'] as const;

function Footer(_props: FooterProps) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        backgroundColor: '#2d2d2d',
        borderTop: '1px solid #404040',
        color: '#a0a0a0',
        fontSize: '12px',
      }}
    >
      <div style={{ display: 'flex', gap: '16px' }}>
        {STATUS_ITEMS.map((item, index) => (
          <span key={item}>
            {item}
            {index < STATUS_ITEMS.length - 1 && <span> •</span>}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>Layout System</span>
      </div>
    </div>
  );
}

export const FooterComponent = memo(Footer);
export { FooterComponent as Footer };

