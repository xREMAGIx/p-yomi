import { mapModifiers } from "@client/libs/functions";
import DOMPurify from "dompurify";
import React from "react";
import "./index.scss";

export type TextStyle = (
  | GeneralTextStyle
  | TextSizes
  | Color
  | "inline"
  | "primaryColor"
  | "secondaryColor"
)[];

interface TextProps {
  modifiers?: TextStyle;
  type?: "p" | "span" | "div";
  content?: string;
  children?: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  modifiers,
  type = "p",
  content,
  children,
}) => {
  const Element = type;
  return (
    <>
      {content ? (
        <Element
          className={mapModifiers("a-text", modifiers)}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content, { ADD_TAGS: ["iframe"] }),
          }}
        />
      ) : (
        <Element className={mapModifiers("a-text", modifiers)}>
          {children}
        </Element>
      )}
    </>
  );
};

Text.defaultProps = {
  modifiers: undefined,
  type: "p",
  content: undefined,
};

export default Text;
