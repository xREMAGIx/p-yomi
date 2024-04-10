import { mapModifiers } from "@client/libs/functions";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";

type OriginVertical = "top" | "center" | "bottom";
type OriginHorizontal = "left" | "center" | "right";

interface PopperProps {
  anchorOrigin?: {
    vertical: OriginVertical;
    horizontal: OriginHorizontal;
  };
  transformOrigin?: {
    vertical: OriginVertical;
    horizontal: OriginHorizontal;
  };
  customContentClass?: string;
  toggleEl?: React.ReactNode;
  children?: React.ReactNode;
}

const Popper: React.FC<PopperProps> = ({
  children,
  toggleEl,
  customContentClass,
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "left",
  },
}) => {
  //* States
  const [isOpen, setIsOpen] = useState(false);

  //* Refs
  const popperRef = useRef<HTMLDivElement>(null);

  //* Functions
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  //* Effects
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (popperRef.current && !popperRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div
      ref={popperRef}
      className={mapModifiers(
        "m-popper",
        isOpen && "open",
        anchorOrigin && [
          `av-${anchorOrigin.vertical}`,
          `ah-${anchorOrigin.horizontal}`,
        ],
        transformOrigin &&
          `t-v${transformOrigin.vertical}-h${transformOrigin.horizontal}`
      )}
    >
      <div className="m-popper_toggle" onClick={handleToggle}>
        {toggleEl}
      </div>
      <div className="m-popper_wrapper">
        <div className={`m-popper_content ${customContentClass ?? ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

Popper.defaultProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};

export default Popper;
