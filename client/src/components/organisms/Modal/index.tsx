import Icon, { IconName } from "@client/components/atoms/Icon";
import { mapModifiers } from "@client/libs/functions";
import React from "react";
import { default as CustomReactModal } from "react-modal";
import "./index.scss";

interface Props {
  isOpen: boolean;
  handleClose?: () => void;
  className?: string;
  iconName?: IconName;
  modifier?: "default" | "videoModal";
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  children?: React.ReactNode;
}

const Modal: React.FC<Props> = ({
  isOpen,
  handleClose,
  children,
  className,
  modifier,
  iconName,
  headerComponent,
  footerComponent,
}) => (
  <CustomReactModal
    isOpen={isOpen}
    onRequestClose={handleClose}
    closeTimeoutMS={250}
    className={`${mapModifiers("o-modal", className, modifier)}`}
    appElement={document.getElementById("root") as HTMLElement}
    ariaHideApp={false}
    portalClassName={mapModifiers("o-modal_portal", isOpen && "open")}
    htmlOpenClassName="reactmodal-html-open"
  >
    <div className="o-modal_main">
      <div className="o-modal_wrapper">
        {handleClose && (
          <button type="button" className="o-modal_close" onClick={handleClose}>
            <Icon iconName={iconName || "close"} size="16" />
          </button>
        )}
        {headerComponent && (
          <div className="o-modal_header">{headerComponent}</div>
        )}
        <div className="o-modal_body">{children}</div>
        {footerComponent && (
          <div className="o-modal_footer">{footerComponent}</div>
        )}
      </div>
    </div>
  </CustomReactModal>
);

Modal.defaultProps = {
  handleClose: undefined,
  className: undefined,
  iconName: "close",
  modifier: "default",
  headerComponent: undefined,
  footerComponent: undefined,
};

export default Modal;
