import Image from "@client/components/atoms/Image";
import { handleScrollCenter, mapModifiers } from "@client/libs/functions";
import React, { useLayoutEffect, useRef } from "react";
import "./index.scss";

type AlignItem = "left" | "center";

type BorderBottom = "border" | "noBorder";

export type TabTypes = ("primary" | "secondary" | BorderBottom | AlignItem)[];

interface TabProps {
  label?: string;
  imgSrc?: string;
  active?: boolean;
  handleClick?: () => void;
  customComponent?: React.ReactNode;
}

interface TabPanelProps {
  active?: boolean;
  children?: React.ReactNode;
}

type TabsProps = {
  variableMutate?: number | string;
  classTabsActive?: string;
  modifiers?: TabTypes;
  customComponent?: React.ReactNode;
  children?: React.ReactNode;
};

export const TabPanel: React.FC<TabPanelProps> = ({ active, children }) => (
  <div className={mapModifiers("o-tabs_panel", active && "active")}>
    {children}
  </div>
);

export const Tab: React.FC<TabProps> = React.memo(
  ({ active, imgSrc, label, handleClick, customComponent }) => (
    <div
      onClick={handleClick}
      className={mapModifiers(
        "o-tabs_tab",
        active && "active",
        !!customComponent && "customComponent"
      )}
    >
      {imgSrc && (
        <div className="o-tabs_label-img">
          <Image imgSrc={imgSrc} ratio="1x1" alt={label || ""} size="cover" />
        </div>
      )}
      {label && <span className="o-tabs_label">{label}</span>}
      {customComponent}
    </div>
  )
);

export const Tabs: React.FC<TabsProps> = ({
  children,
  variableMutate,
  classTabsActive,
  modifiers,
  customComponent,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    handleScrollCenter(ref, classTabsActive || ".o-tabs_tab-active");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variableMutate]);

  return (
    <div className={mapModifiers("o-tabs", modifiers)}>
      <div ref={ref} className="o-tabs_labels">
        {children}
      </div>
      {customComponent}
    </div>
  );
};

TabPanel.defaultProps = {
  active: false,
};

Tab.defaultProps = {
  label: "",
  imgSrc: "",
  active: false,
  handleClick: undefined,
  customComponent: undefined,
};

Tabs.defaultProps = {
  variableMutate: undefined,
  classTabsActive: "",
  modifiers: ["secondary", "center"],
  customComponent: undefined,
};

export default Tabs;
