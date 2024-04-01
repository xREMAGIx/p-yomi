import {
  Link as TsrLink,
  LinkOptions,
  RegisteredRouter,
} from "@tanstack/react-router";
import "./index.scss";

type RT = RegisteredRouter["routeTree"];

export interface LinkProps {
  href?: string;
  customClassName?: string;
  useExternal?: boolean;
  target?: string;
  title?: string;
  activeClassName?: string;
  handleClick?: () => void;
  children?: React.ReactNode;
}

const Link = <TTo extends string = ".">({
  href,
  useExternal,
  title,
  customClassName = "",
  target = "_self",
  activeClassName = "",
  children,
  handleClick,
  ...props
}: LinkOptions<RT, "/", TTo> & LinkProps) => {
  if (useExternal) {
    return (
      <a
        className={`a-link ${customClassName} ${activeClassName}`}
        target={target}
        href={href}
        rel="noreferrer"
        title={title}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <TsrLink
      {...props}
      className={`a-link ${customClassName}`}
      activeProps={{
        className: `active ${activeClassName}`,
      }}
    >
      {children}
    </TsrLink>
  );
};

export default Link;
