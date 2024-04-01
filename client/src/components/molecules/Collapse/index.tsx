import React from "react";
import "./index.scss";
import Icon, { IconName } from "@client/components/atoms/Icon";
import Text from "@client/components/atoms/Text";

import { mapModifiers } from "@client/libs/functions";

interface CollapseProps {
  children?: React.ReactNode;
  iconName?: IconName;
  title?: string;
  active?: boolean;
  handleOpen?: () => void;
  hasBorder?: boolean;
  startReport?: boolean;
  isEmpty?: boolean;
}

const Collapse: React.FC<CollapseProps> = ({
  children,
  iconName,
  title,
  active,
  handleOpen,
  hasBorder,
  startReport,
  isEmpty,
}) => (
  <div
    className={mapModifiers(
      "o-collapse",
      active && !isEmpty && "active",
      startReport && "startReport"
    )}
  >
    <div
      className={mapModifiers("o-collapse_header", hasBorder && "border")}
      onClick={() => {
        if (!isEmpty && handleOpen) {
          handleOpen();
        }
      }}
    >
      {iconName && (
        <div className="o-collapse_header-iconLeft">
          <Icon iconName={iconName} size="24" />
        </div>
      )}
      <div className="o-collapse_header-title">
        <Text modifiers={[]}>{title}</Text>
      </div>
      <div className="o-collapse_header-iconRight">
        <div />
        <div />
      </div>
    </div>
    <div
      style={{
        height: active ? "auto" : 0,
      }}
      className="o-collapse_sub"
    >
      <div className="o-collapse_content">{children}</div>
    </div>
  </div>
);

export default Collapse;
