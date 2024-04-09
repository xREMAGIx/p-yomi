import React from "react";
import "./index.scss";
import { Outlet } from "@tanstack/react-router";
import Sidebar from "../Sidebar";
import Headbar from "../Headbar";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="t-layout">
      <div className="t-layout_left">
        <Sidebar />
      </div>
      <div className="t-layout_right">
        <div className="t-layout_headbar">
          <Headbar />
        </div>
        <div className="t-layout_content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

Layout.defaultProps = {};

export default Layout;
