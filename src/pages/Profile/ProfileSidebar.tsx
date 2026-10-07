import { useState } from "react";
import type User from "../../types/User";
import { formatDate, getInitials } from "../../utils/profile";
import { getUserPhotoUrl } from "../../utils/profile";



interface ProfileSidebarProps {
  user: User;
}

export function ProfileSidebar({
  user,
}: ProfileSidebarProps) {


    const [hasImageError, setHasImageError] = useState(false);


const photoUrl = getUserPhotoUrl(user.photo ?? "");
const showImage = Boolean(photoUrl) && !hasImageError;


  const initials = getInitials(user.name || "User");

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex flex-col items-center text-center">
{showImage ? (
  <img
    src={photoUrl ?? undefined}
    alt={user.name || "Profile"}
    className="h-28 w-28 rounded-full object-cover ring-4 ring-teal-100 dark:ring-teal-500/20"
    onError={() => setHasImageError(true)}
  />
) : (
  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-teal-600 text-3xl font-bold text-white ring-4 ring-teal-100 dark:ring-teal-500/20">
    {initials}
  </div>
)}
        <h2 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
          {user.name || "User"}
        </h2>

        <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
          {user.email}
        </p>


        {user.pendingEmail && (
  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
    Pending confirmation:{" "}
    <strong className="break-all">{user.pendingEmail}</strong>
  </p>
)}

        <span className="mt-4 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold capitalize text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
          {user.role ?? "user"}
        </span>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Member since
        </p>

        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
          {formatDate(user.createdAt)}
        </p>
      </div>
    </aside>
  );
}