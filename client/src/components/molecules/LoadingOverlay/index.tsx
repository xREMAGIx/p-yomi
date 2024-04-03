import kuruGif from "@client/assets/gif/kuru-kururing.gif";
import Image from "@client/components/atoms/Image";
import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

interface LoadingOverlayProps {
  isLoading?: boolean;
  modifiers?: ("outer-16" | "noBackground" | "relative")[];
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  modifiers,
}) => {
  if (!isLoading) return null;

  return (
    <div className={mapModifiers("m-loadingOverlay", modifiers)}>
      <div className="m-loadingOverlay_loading">
        <Image imgSrc={kuruGif} alt="loading" ratio="1x1" />
      </div>
    </div>
  );
};

LoadingOverlay.defaultProps = {};

export default LoadingOverlay;
