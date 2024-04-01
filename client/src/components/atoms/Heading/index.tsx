import { mapModifiers } from "@client/libs/functions";
import DOMPurify from "dompurify";
import React from "react";
import "./index.scss";

type Colors = "primaryColor" | "secondaryColor";
export type Sizes = "20x30" | "24x32" | "32x48";
export type TextStyle = (GeneralTextStyle | Sizes | Colors)[];

interface HeadingProps {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  content?: string;
  modifiers?: TextStyle;
  children?: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  type = "h2",
  content,
  modifiers,
}) => {
  const Element = type;
  return (
    <>
      {content ? (
        <Element
          className={mapModifiers("a-heading", modifiers)}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        />
      ) : (
        <Element className={mapModifiers("a-heading", modifiers)}>
          {children}
        </Element>
      )}
    </>
  );
};

Heading.defaultProps = {
  type: "h2",
  modifiers: undefined,
  content: undefined,
};

export default Heading;
