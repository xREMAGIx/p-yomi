import React, { useMemo } from "react";
import "./index.scss";
import useDeviceQueries from "@client/hooks/useDeviceQueries";
import { mapModifiers } from "@client/libs/functions";

export type SizeImageType = "cover" | "contain" | "inherit" | "initial";

interface ImageProps {
  imgSrc: string;
  srcTablet?: string;
  srcMobile?: string;
  alt: string;
  ratio: Ratio;
  size?: SizeImageType;
}

const Image: React.FC<ImageProps> = ({
  imgSrc,
  srcTablet,
  srcMobile,
  alt,
  ratio,
  size,
}) => {
  const { isMobile, isTablet } = useDeviceQueries();

  const sourceImage = useMemo(() => {
    if (isMobile) {
      return srcMobile || imgSrc;
    }
    if (isTablet) {
      return srcTablet || imgSrc;
    }
    return imgSrc;
  }, [isMobile, isTablet, imgSrc, srcMobile, srcTablet]);

  return (
    <div
      className={mapModifiers("a-image", ratio, size)}
      style={{ backgroundImage: `url(${sourceImage})` }}
    >
      <img src={sourceImage} alt={alt} />
    </div>
  );
};

Image.defaultProps = {
  srcTablet: undefined,
  srcMobile: undefined,
  size: "cover",
};

export default Image;
