import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Switch from "@client/components/atoms/Switch";
import Text from "@client/components/atoms/Text";
import Popper, { PopperRef } from "@client/components/molecules/Popper";
import { useTranslation } from "@client/libs/translation";
import { LOCALES_LIST } from "@client/locales";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";

type Theme = "dark" | "light";

interface HeadbarProps {}

const Headbar: React.FC<HeadbarProps> = () => {
  //* Hooks
  const { t } = useTranslation();
  const { setLocale, locale } = useTranslation();

  //* States
  const [theme, setTheme] = useState<Theme>("dark");

  //* Refs
  const languagePopperRef = useRef<PopperRef>(null);

  //* Effects
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="t-headbar">
      <div className="t-headbar_background" />
      <div className="u-d-flex u-flex-ai-center u-flex-jc-end">
        <div className="u-m-r-8">
          <Popper
            ref={languagePopperRef}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            toggleEl={
              <Button variant="transparent" modifiers={["inline"]}>
                <div className="u-m-r-4">
                  <Icon iconName="language" />
                </div>
                <Text>{t(`locale.${locale}`)}</Text>
              </Button>
            }
            customContentClass="u-m-t-8"
          >
            {LOCALES_LIST.map((locale) => (
              <Button
                key={`locale-${locale}`}
                variant="transparent"
                onClick={() => {
                  setLocale(locale);
                  languagePopperRef.current?.handleClose();
                }}
              >
                {t(`locale.${locale}`)}
              </Button>
            ))}
          </Popper>
        </div>
        <div className="t-headbar_darkmode">
          <Switch
            inputId="darkmode"
            offElement={
              <Text modifiers={["babyPowder", "14x20"]}>
                {t(`setting.light`)}
              </Text>
            }
            onElement={
              <Text modifiers={["babyPowder", "14x20"]}>
                {t(`setting.dark`)}
              </Text>
            }
            isChecked={theme === "light"}
            handleChange={(e) => {
              setTheme(e.target.checked ? "light" : "dark");
            }}
          />
        </div>
      </div>
    </div>
  );
};

Headbar.defaultProps = {};

export default Headbar;
