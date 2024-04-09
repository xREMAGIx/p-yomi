import Switch from "@client/components/atoms/Switch";
import { useTranslation } from "@client/libs/translation";
import React, { useEffect, useState } from "react";
import "./index.scss";

type Theme = "dark" | "light";

interface HeadbarProps {}

const Headbar: React.FC<HeadbarProps> = () => {
  //* Hooks
  const { setLocale, locale } = useTranslation();

  //* States
  const [theme, setTheme] = useState<Theme>("dark");

  //* Effects
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="t-headbar">
      <div className="t-headbar_background" />
      <div className="u-d-flex u-flex-ai-center u-flex-jc-end">
        <div className="u-m-r-8">
          <select
            value={locale}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setLocale(event.target.value)
            }
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
          </select>
        </div>
        <div className="t-headbar_darkmode">
          <Switch
            inputId="darkmode"
            firstLabel="Dark"
            secondLabel="Light"
            isChecked={theme === "dark"}
            handleChange={(e) => {
              setTheme(e.target.checked ? "dark" : "light");
            }}
          />
        </div>
      </div>
    </div>
  );
};

Headbar.defaultProps = {};

export default Headbar;
