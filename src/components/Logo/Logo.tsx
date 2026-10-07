import { NavLink } from "react-router-dom";
import touristIcon from "../../assets/tourist-svgrepo-com.svg";

function Logo() {
  return (
    <NavLink
      to="/"
      aria-label="Natours Home"
      className="flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      <img
        src={touristIcon}
        alt="Natours Logo"
        className="h-8 w-8 object-contain dark:invert"
      />
      <span className="text-lg font-bold tracking-tight text-teal-700 dark:text-teal-300">
        Natours
      </span>
    </NavLink>
  );
}

export default Logo;
