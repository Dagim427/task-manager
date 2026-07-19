import { Menu, Search, Bell, User, ChevronDown } from "lucide-react";
import classes from "./Header.module.css";

function Header() {
  return (
    <>
      <div className={classes.header__container}>
        <div className={classes.menu__section}>
          <div className={classes.menu__icon}>
            <Menu size={20} />
          </div>
        </div>

        <div className={classes.search__section}>
          <div className={classes.input__wrapper}>
            <Search size={20} className={classes.search__icon} />
            <input
              type="text"
              name=""
              id=""
              className={classes.form__control}
              placeholder="Search task"
            />
          </div>
        </div>

        <div className={classes.account__section}>
          <div className={classes.notification__wrapper}>
            <div className={classes.notification__count}>0</div>
            <div className={classes.bell__icon_wrapper}>
              <Bell className={classes.bell__icon} />
            </div>
          </div>

          <div className={classes.profile__wrapper}>
            <div className={classes.profile__icon_wrapper}>
              <div className={classes.user__icon_wrapper}>
                <User className={classes.user__icon} />
              </div>
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
