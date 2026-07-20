import classes from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";

import {
  Zap,
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Star,
  User,
  Settings,
  LogOut,
  X, // 1. Import X icon
} from "lucide-react";

const mainNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/tasks", label: "My Tasks", icon: ListTodo, count: 7 },
  { path: "/completed", label: "Completed", icon: CheckCircle2, count: 2 },
  { path: "/important", label: "Important", icon: Star, count: 3 },
];

const accountItems = [
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/logout", label: "Log out", icon: LogOut, isDanger: true },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Darkened Backdrop overlay */}
      <div 
        className={`${classes.backdrop} ${isOpen ? classes.showBackdrop : ""}`} 
        onClick={onClose}
      />

      {/* Sidebar Drawer Container */}
      <div 
        className={`${classes.sidebar__container} ${isOpen ? classes.open : ""}`}
      >
        {/* --- LOGO & CLOSE BUTTON SECTION --- */}
        <div className={classes.logo__section}>
          <div className={classes.logo__brand}>
            <div className={classes.logo__icon}>
              <Zap />
            </div>
            <div className={classes.logo__name}>TaskFlow</div>
          </div>

          {/* 2. Close 'X' Button (Visible on Mobile) */}
          <button 
            className={classes.close__btn} 
            onClick={onClose} 
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className={classes.main__section}>
          {/* --- MAIN MENU --- */}
          <div className={classes.menu__section}>
            <p className={classes.menu__label}>MENU</p>

            <ul className={classes.navList}>
              {mainNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      onClick={onClose} /* Closes drawer on link click */
                      className={({ isActive }) =>
                        isActive
                          ? `${classes.navLink} ${classes.active}`
                          : classes.navLink
                      }
                    >
                      <div className={classes.link__content}>
                        <Icon className={classes.nav__icon} size={20} />
                        <span>{item.label}</span>
                      </div>
                      {item.count && (
                        <span className={classes.badge}>{item.count}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* --- ACCOUNT SECTION --- */}
          <div className={classes.account__section}>
            <ul className={classes.navList}>
              {accountItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) => {
                        let linkClass = item.isDanger
                          ? `${classes.navLink} ${classes.navLinkDanger}`
                          : classes.navLink;
                        return isActive ? `${linkClass} ${classes.active}` : linkClass;
                      }}
                    >
                      <div className={classes.link__content}>
                        <Icon className={classes.nav__icon} size={20} />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <div className={classes.user__section}>
              <div className={classes.user__avatar}>
                <span>D</span>
              </div>
              <div className={classes.user__details}>
                <h3>Dagi</h3>
                <p>dagi@taskflow.io</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;