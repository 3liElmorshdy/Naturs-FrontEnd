import { NavLink } from "react-router-dom";
import touristIcon from "../../assets/tourist-svgrepo-com.svg";

function Logo() {
  return (
    <NavLink
      to="/"
      aria-label="Tejwal Home"
      className="flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      <img
        src={touristIcon}
        alt="Tejwal Logo"
        className="h-8 w-8 object-contain dark:invert"
      />
      <span className="text-lg font-bold tracking-tight text-teal-700 dark:text-teal-300">
        Tejwal
      </span>
    </NavLink>
  );
}

export default Logo;
