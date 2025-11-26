import { useRef, useEffect, useMemo, useCallback } from 'preact/hooks';
import type { JSX } from 'preact';
import { memo } from 'preact/compat';
import { effect } from '@preact/signals';
import { GoldenLayout, type ComponentContainer, type LayoutConfig, type ComponentItemConfig } from 'golden-layout';
import { render, h } from 'preact';
import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import { ColoredPanel, type ColoredPanelProps } from './ColoredPanel';
import { panelDefinitionMap, type PanelKind } from '../config/panels';
import { latestCommand, emitCommand } from '../signals/commandBus';

interface GoldenLayoutWrapperProps {
  readonly containerId?: string;
}

function GoldenLayoutWrapper({ containerId = 'golden-layout-container' }: GoldenLayoutWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<GoldenLayout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const createPanelConfig = (panelId: PanelKind, size?: string): ComponentItemConfig => {
    const definition = panelDefinitionMap[panelId];
    const config: ComponentItemConfig = {
      type: 'component',
      componentType: 'colored-panel',
      title: definition.title,
      componentState: { label: definition.label, color: definition.color },
      header: {
        popout: false,
      },
    };

    if (size !== undefined) {
      config.size = size;
    }

    return config;
  };

  const layoutConfig: LayoutConfig = useMemo(
    () => ({
      settings: {
        showPopoutIcon: false,
      },
      root: {
        type: 'row',
        content: [
          createPanelConfig('red', '50%'),
          {
            type: 'column',
            content: [
              createPanelConfig('blue', '40%'),
              {
                type: 'row',
                content: [createPanelConfig('yellow', '50%'), createPanelConfig('green', '50%')],
              },
            ],
          },
        ],
      },
    }),
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error('GoldenLayoutWrapper: Container ref is null');
      return;
    }

    let layout: GoldenLayout;
    try {
      layout = new GoldenLayout(container);
      layoutRef.current = layout;
    } catch (error) {
      console.error('GoldenLayoutWrapper: Failed to create GoldenLayout instance', error);
      return;
    }

    const registerComponent = (
      typeName: string,
      Component: (props: ColoredPanelProps) => JSX.Element,
      defaultProps: Partial<ColoredPanelProps> = {}
    ) => {
      layout.registerComponentFactoryFunction(
        typeName,
        (containerInstance: ComponentContainer, state: unknown) => {
          const stateProps = state as Partial<ColoredPanelProps>;
          const props: ColoredPanelProps = {
            ...defaultProps,
            ...stateProps,
            glContainer: containerInstance,
            glEventHub: layout.eventHub,
          } as ColoredPanelProps;

          const containerElement = containerInstance.element;
          containerElement.style.width = '100%';
          containerElement.style.height = '100%';
          containerElement.style.overflow = 'auto';

          const preactRoot = document.createElement('div');
          preactRoot.style.width = '100%';
          preactRoot.style.height = '100%';
          containerElement.appendChild(preactRoot);

          render(h(Component, props), preactRoot);

          const handleDestroy = () => {
            render(null, preactRoot);
            containerInstance.off('destroy', handleDestroy);
          };

          containerInstance.on('destroy', handleDestroy);

          return preactRoot as unknown as ComponentContainer.Component;
        }
      );
    };

    registerComponent('colored-panel', ColoredPanel);
    layout.loadLayout(layoutConfig);

    const handleResize = () => {
      if (layout && container) {
        layout.updateSize(container.offsetWidth, container.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      if (layout && container) {
        requestAnimationFrame(() => {
          if (layout && container) {
            layout.updateSize(container.offsetWidth, container.offsetHeight);
          }
        });
      }
    });

    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    const disposeCommandEffect = effect(() => {
      const command = latestCommand.value;
      if (!command || command.type !== 'palette:add-panel') {
        return;
      }

      const panelId = (command.payload as { panelId?: PanelKind } | undefined)?.panelId;
      if (!panelId) {
        return;
      }

      const definition = panelDefinitionMap[panelId];
      if (!definition) {
        console.warn(`Unknown panelId ${panelId}`);
        return;
      }

      layout.addComponent(
        'colored-panel',
        { label: definition.label, color: definition.color },
        definition.title,
      );
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      layout.destroy();
      layoutRef.current = null;
      disposeCommandEffect();
    };
  }, [layoutConfig]);

  const handleDragOver = useCallback<JSX.DragEventHandler<HTMLDivElement>>((event) => {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return;
    event.preventDefault();
    dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback<JSX.DragEventHandler<HTMLDivElement>>((event) => {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return;

    const rawCommand = dataTransfer.getData('application/x-command');
    if (!rawCommand) return;

    event.preventDefault();

    try {
      const command = JSON.parse(rawCommand) as { type: string; payload?: { panelId?: PanelKind } };
      emitCommand(command.type, command.payload, 'drag');
    } catch (error) {
      console.warn('Failed to parse dropped command payload', error);
    }
    document.body.classList.remove('command-drag-active');
  }, []);

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
}

export const GoldenLayoutWrapperComponent = memo(GoldenLayoutWrapper);
export { GoldenLayoutWrapperComponent as GoldenLayoutWrapper };

