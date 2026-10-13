import { useRef, useState } from "react";
import type User from "../../types/User";
import { formatDate, getInitials } from "../../utils/profile";
import { getUserPhotoUrl } from "../../utils/profile";



interface ProfileSidebarProps {
  user: User;
  onImageChange: (file: File) => void;
}

export function ProfileSidebar({
  user,
  onImageChange,
}: ProfileSidebarProps) {


    const [hasImageError, setHasImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


const photoUrl = getUserPhotoUrl(user.photo ?? "");
const showImage = Boolean(photoUrl) && !hasImageError;


  const initials = getInitials(user.name || "User");

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex flex-col items-center text-center">
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  hidden
  onChange={(event) => {
    const file = event.target.files?.[0];
    if (file) onImageChange(file);
    event.target.value = "";
  }}
/>

<button
  type="button"
  title="Change photo"
  aria-label="Change profile photo"
  onClick={() => fileInputRef.current?.click()}
  className="group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full ring-4 ring-teal-100 dark:ring-teal-500/20"
>
  {showImage ? (
    <img
      src={photoUrl ?? undefined}
      alt={user.name || "Profile"}
      className="h-full w-full object-cover"
      onError={() => setHasImageError(true)}
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center bg-teal-600 text-3xl font-bold text-white">
      {initials}
    </span>
  )}

  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
    Change photo
  </span>
</button>
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