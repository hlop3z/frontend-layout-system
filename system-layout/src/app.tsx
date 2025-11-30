import { useState, useCallback } from "preact/hooks";
import type { JSX } from "preact";
import { GoldenLayoutWrapper } from "./components/GoldenLayoutWrapper";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar";
import { ResizableSidebar } from "./components/ResizableSidebar";
import { layoutConfig } from "./config/layout";
import "./app.css";

const INITIAL_SIDEBAR_WIDTH = 250;
const MIN_SIDEBAR_WIDTH = 150;
const MAX_SIDEBAR_WIDTH = 600;
const HEADER_HEIGHT = "40px";
const FOOTER_HEIGHT = "30px";

const APP_STYLE: JSX.CSSProperties = {
  width: "100%",
  height: "100vh",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: "#1e1e1e",
};

const HEADER_CONTAINER_STYLE: JSX.CSSProperties = {
  flexShrink: 0,
  height: HEADER_HEIGHT,
  borderBottom: "1px solid #3e3e42",
};

const MAIN_CONTAINER_STYLE: JSX.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  display: "flex",
  flexDirection: "row",
  gap: `${layoutConfig.sectionGap}px`,
};

const CENTER_CONTAINER_STYLE: JSX.CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const FOOTER_CONTAINER_STYLE: JSX.CSSProperties = {
  flexShrink: 0,
  height: FOOTER_HEIGHT,
  borderTop: "1px solid #3e3e42",
};

export function App() {
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(
    INITIAL_SIDEBAR_WIDTH
  );
  const [rightSidebarWidth, setRightSidebarWidth] = useState(
    INITIAL_SIDEBAR_WIDTH
  );

  const handleLeftResize = useCallback((width: number) => {
    setLeftSidebarWidth(width);
  }, []);

  const handleRightResize = useCallback((width: number) => {
    setRightSidebarWidth(width);
  }, []);

  return (
    <div style={APP_STYLE}>
      <div style={HEADER_CONTAINER_STYLE}>
        <Header />
      </div>
      <div style={MAIN_CONTAINER_STYLE}>
        <ResizableSidebar
          side="left"
          initialWidth={leftSidebarWidth}
          minWidth={MIN_SIDEBAR_WIDTH}
          maxWidth={MAX_SIDEBAR_WIDTH}
          onResize={handleLeftResize}
        >
          <LeftSidebar />
        </ResizableSidebar>
        <div style={CENTER_CONTAINER_STYLE}>
          <GoldenLayoutWrapper />
        </div>
        <ResizableSidebar
          side="right"
          initialWidth={rightSidebarWidth}
          minWidth={MIN_SIDEBAR_WIDTH}
          maxWidth={MAX_SIDEBAR_WIDTH}
          onResize={handleRightResize}
        >
          <RightSidebar />
        </ResizableSidebar>
      </div>
      <div style={FOOTER_CONTAINER_STYLE}>
        <Footer />
      </div>
    </div>
  );
}
