import clsx from "clsx";
import React from "react";
import styles from "./NavBar.module.css";

// ─── Inline icon components ───────────────────────────────────────────────────

const AddPanelIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="9" y1="5.5" x2="9" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5.5" y1="9" x2="12.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface PanelSideIconProps {
  active?: boolean;
  side: "left" | "right";
}

const PanelSideIcon: React.FC<PanelSideIconProps> = ({ active, side }) => {
  const splitX = side === "left" ? 6.3 : 11.7;
  const fillLeft = side === "left" && active;
  const fillRight = side === "right" && active;
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1={splitX} y1="1.5" x2={splitX} y2="16.5" stroke="currentColor" strokeWidth="1.2" />
      {fillLeft && (
        <rect x="2" y="2" width={splitX - 2} height="14" rx="1.5" fill="currentColor" opacity="0.25" />
      )}
      {fillRight && (
        <rect x={splitX} y="2" width={16 - splitX} height="14" rx="1.5" fill="currentColor" opacity="0.25" />
      )}
    </svg>
  );
};

// ─── NavBar ───────────────────────────────────────────────────────────────────

export interface NavBarProps {
  logo?: React.ReactNode;
  breadcrumb?: string[];
  tabs?: Array<{ label: string; value: string }>;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onAddPanel?: () => void;
  leftSidebarOpen?: boolean;
  onToggleLeftSidebar?: () => void;
  rightSidebarOpen?: boolean;
  onToggleRightSidebar?: () => void;
  rightActions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const NavBar: React.FC<NavBarProps> = ({
  logo,
  breadcrumb,
  tabs,
  activeTab,
  onTabChange,
  onAddPanel,
  leftSidebarOpen,
  onToggleLeftSidebar,
  rightSidebarOpen,
  onToggleRightSidebar,
  rightActions,
  className,
  style,
}) => {
  return (
    <div className={clsx(styles.root, className)} style={style}>
      {logo && <div className={styles.logo}>{logo}</div>}

      {breadcrumb && breadcrumb.length > 0 && (
        <div className={styles.breadcrumb}>
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className={styles.breadcrumbSep}>/</span>}
              <span className={styles.breadcrumbCrumb}>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
      )}

      {tabs && tabs.length > 0 && (
        <>
          <div className={styles.divider} />
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={clsx(styles.tab, { [styles.tabActive]: activeTab === tab.value })}
                onClick={() => onTabChange?.(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      <div className={styles.spacer} />

      <div className={styles.panelControls}>
        {onAddPanel && (
          <button
            className={styles.iconBtn}
            onClick={onAddPanel}
            type="button"
            title="Add panel"
            aria-label="Add panel"
          >
            <AddPanelIcon />
          </button>
        )}
        {onToggleLeftSidebar && (
          <button
            className={clsx(styles.iconBtn, { [styles.iconBtnActive]: leftSidebarOpen })}
            onClick={onToggleLeftSidebar}
            type="button"
            title="Toggle left sidebar"
            aria-label="Toggle left sidebar"
          >
            <PanelSideIcon side="left" active={leftSidebarOpen} />
          </button>
        )}
        {onToggleRightSidebar && (
          <button
            className={clsx(styles.iconBtn, { [styles.iconBtnActive]: rightSidebarOpen })}
            onClick={onToggleRightSidebar}
            type="button"
            title="Toggle right sidebar"
            aria-label="Toggle right sidebar"
          >
            <PanelSideIcon side="right" active={rightSidebarOpen} />
          </button>
        )}
      </div>

      {rightActions && (
        <>
          <div className={styles.separator} />
          <div className={styles.rightActions}>{rightActions}</div>
        </>
      )}
    </div>
  );
};

export default NavBar;
