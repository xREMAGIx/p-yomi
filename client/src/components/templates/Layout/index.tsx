import React from "react";
import "./index.scss";
import { Outlet } from "@tanstack/react-router";
import Sidebar from "../Sidebar";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="t-layout">
      <div className="t-layout_left">
        <Sidebar />
      </div>
      <div className="t-layout_right">
        <Outlet />
      </div>
    </div>
  );
};

Layout.defaultProps = {};

export default Layout;
