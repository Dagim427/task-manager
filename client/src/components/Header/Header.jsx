import { useState } from "react";
import { Menu, Search, Bell, User, ChevronDown, Plus } from "lucide-react";
import classes from "./Header.module.css";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

        <div className={classes.new__task_btn}>
          <Plus className={classes.plus__icon} />
          New Task
        </div>

        <div className={classes.account__section}>
          <div className={classes.notification__wrapper}>
            <div className={classes.notification__count}>0</div>
            <div className={classes.bell__icon_wrapper}>
              <Bell className={classes.bell__icon} />
            </div>
          </div>

          <div className={classes.profile__wrapper}>
            <div
              className={classes.profile__icon_wrapper}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className={classes.user__icon_wrapper}>
                <User className={classes.user__icon} />
              </div>
              <ChevronDown />
            </div>
          </div>

          {isProfileOpen && (
            <div className={classes.profile__dropdown_wrapper}>
              <div className={classes.name__section}>
                <h3>Alex Johnson</h3>
                <p>alex@gmail.com</p>
              </div>

              <div className={classes.profile__section}>
                <ul>
                  <li>Profile</li>
                  <li>Settings</li>
                </ul>
              </div>
              <div className={classes.logout__section}>
                <button className={classes.logout__btn}>Sign out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
