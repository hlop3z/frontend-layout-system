import { useRef, useEffect, useState, useCallback } from 'preact/hooks';
import type { JSX } from 'preact';
import { layoutConfig } from '../config/layout';
import { memo } from 'preact/compat';
import type { ComponentChildren } from 'preact';

interface ResizableSidebarProps {
  readonly children: ComponentChildren;
  readonly initialWidth: number;
  readonly minWidth?: number;
  readonly maxWidth?: number;
  readonly side: 'left' | 'right';
  readonly onResize?: (width: number) => void;
}

function ResizableSidebar({
  children,
  initialWidth,
  minWidth = 150,
  maxWidth = 600,
  side,
  onResize,
}: ResizableSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = sidebarRef.current?.offsetWidth ?? initialWidth;

      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    },
    [initialWidth]
  );

  useEffect(() => {
    const handle = resizeHandleRef.current;
    if (!handle) return;

    handle.addEventListener('mousedown', handleMouseDown);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleMouseDown]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;

      const deltaX = side === 'left' ? e.clientX - startXRef.current : startXRef.current - e.clientX;

      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));

      sidebarRef.current.style.width = `${newWidth}px`;
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      stopResizing();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, side, minWidth, maxWidth, onResize, stopResizing]);

  const resizeHandleStyle: JSX.CSSProperties = {
    width: `${layoutConfig.resizeHandleWidth}px`,
    height: '100%',
    flexShrink: 0,
    cursor: 'ew-resize',
    backgroundColor: isHovered || isResizing ? '#007acc' : 'transparent',
    position: 'relative',
    transition: isResizing ? 'none' : 'background-color 0.2s',
  };

  const containerStyle: JSX.CSSProperties = {
    display: 'flex',
    flexDirection: side === 'left' ? 'row' : 'row-reverse',
    alignItems: 'stretch',
    height: '100%',
    flexShrink: 0,
    gap: 0,
  };

  const sidebarStyle: JSX.CSSProperties = {
    width: `${initialWidth}px`,
    height: '100%',
    flexShrink: 0,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      <div ref={sidebarRef} style={sidebarStyle}>
        {children}
      </div>
      <div
        ref={resizeHandleRef}
        style={resizeHandleStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isResizing && setIsHovered(false)}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: side === 'left' ? '1px' : undefined,
            right: side === 'right' ? '1px' : undefined,
            width: '1px',
            height: '100%',
            backgroundColor: '#3e3e42',
          }}
        />
      </div>
    </div>
  );
}

export const ResizableSidebarComponent = memo(ResizableSidebar);
export { ResizableSidebarComponent as ResizableSidebar };

