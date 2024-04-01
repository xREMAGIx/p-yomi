import React from "react";
import "./index.scss";

interface CardProps {
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="m-card">{children}</div>;
};

Card.defaultProps = {};

export default Card;
