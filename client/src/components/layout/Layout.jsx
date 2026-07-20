import { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import classes from "./Layout.module.css";

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={classes.layout__container}>
      {/* Render Sidebar directly without an extra wrapper div */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className={classes.layout__body}>
        <div className={classes.header__container}>
          <Header onToggleSidebar={toggleSidebar} />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;