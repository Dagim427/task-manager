import classes from "./Header.module.css";
import { Search, Bell, Menu } from "lucide-react";

function Header({ onToggleSidebar }) {
  return (
    <header className={classes.header}>
      {/* LEFT SECTION */}
      <div className={classes.header__left}>
        {/* Hamburger Menu Button (visible on tablet/mobile) */}
        <button 
          className={classes.menu__btn} 
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        {/* Welcome Text (Desktop & Tablet) */}
        <div className={classes.welcome__box}>
          <h1 className={classes.welcome__title}>
            Welcome back, Dagi <span className={classes.wave}>👋</span>
          </h1>
          <p className={classes.welcome__date}>Monday, July 20</p>
        </div>

        {/* Mobile Logo Text (Shown on small mobile screens) */}
        <div className={classes.mobile__logo}>
          <h2>TaskFlow</h2>
        </div>
      </div>

      {/* CENTER SECTION: SEARCH BAR (Desktop only) */}
      <div className={classes.header__center}>
        <div className={classes.search__box}>
          <Search className={classes.search__icon} size={18} />
          <input
            type="text"
            placeholder="Search anything..."
            className={classes.search__input}
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className={classes.header__right}>
        {/* Notification Bell with Red Badge */}
        <button className={classes.notification__btn} aria-label="Notifications">
          <Bell size={20} />
          <span className={classes.notification__badge} />
        </button>

        {/* User Profile */}
        <div className={classes.user__profile}>
          <div className={classes.user__avatar}>
            <span>D</span>
          </div>
          <span className={classes.user__name}>Dagi</span>
        </div>
      </div>
    </header>
  );
}

export default Header;