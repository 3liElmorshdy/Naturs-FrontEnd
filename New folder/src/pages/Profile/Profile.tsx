import { useCallback, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "../../store/store";

import { updateUser } from "../../store/authSlice";
import {
  checkEmailAvailability,
  updateEmail,
  updateMe,
  uploadPhoto,
} from "../../services/users";

import {
  getRequestErrorMessage,
  isDuplicateEmailError,
} from "../../utils/requestError";

import { ConfirmPasswordModal } from "../../components/ConfirmPasswordModal/ConfirmPasswordModal";

import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileForm } from "./ProfileForm";

import type { ProfileFormData } from "../../schemas/profileSchema";

function Profile() {
  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const dispatch = useDispatch<AppDispatch>();

  // الإيميل الجديد المنتظر تأكيد الباسورد في الـ Modal
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingProfileName, setPendingProfileName] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(false);

  const [passwordModalError, setPasswordModalError] =
    useState("");

  const [isEmailUpdating, setIsEmailUpdating] =
    useState(false);

  const initialValues = useMemo<ProfileFormData>(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
    }),
    [user?.name, user?.email],
  );

  const resetMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
    setEmailError("");
  }, []);

  /*
    ProtectedRoute يفترض أن يمنع وصول user === null.
    هذا fallback فقط لحظة إعادة تحميل التطبيق أو انتقال state.
  */
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950" />
    );
  }


  async function handleImageChange(file: File) {
    resetMessages();

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 5MB.");
      return;
    }

    try {
      const updatedUser = await uploadPhoto(file);
      dispatch(updateUser(updatedUser));
      setMessage("Profile photo updated successfully.");
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    }
  }

  function handleEdit() {
    resetMessages();
    setIsEditing(true);
  }

function handleCancel() {
  resetMessages();
  setPasswordModalError("");
  setPendingEmail("");
  setPendingProfileName("");
  setIsEditing(false);
}

  /*
    يستخدم عندما يتغير الاسم فقط.
    لا نرسل email من formData لأن تغيير الإيميل له endpoint خاص
    يحتاج Current Password confirmation.
  */
  async function saveProfileName(name: string) {
    setIsSaving(true);
    resetMessages();

    try {
const updatedUser = await updateMe({
  name: name.trim(),
});
      dispatch(updateUser(updatedUser));

      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  /*
    Save button:
    - لو email لم يتغير → نحفظ الاسم فقط.
    - لو email تغير → نفتح Modal ونطلب Current Password.
  */
  async function handleProfileSubmit(data: ProfileFormData) {


    resetMessages();

    const normalizedEmail = data.email.trim().toLowerCase();

    const emailHasChanged =
      normalizedEmail !== user!.email.trim().toLowerCase();



    /*
      الاسم فقط تغيّر:
      لا نطلب Current Password.
    */
    if (!emailHasChanged) {
      await saveProfileName(data.name);
      return;
    }

    /*
      الإيميل تغيّر:
      نفحصه أولًا قبل فتح Password Modal.
    */
    setIsSaving(true);

    try {
      const isAvailable =
        await checkEmailAvailability(normalizedEmail);

      if (!isAvailable) {
        setEmailError("This email address is already in use.");
        return;
      }

      /*
        الإيميل متاح:
        الآن فقط نطلب Current Password.
      */
      setPendingEmail(normalizedEmail);
      setPendingProfileName(data.name.trim());
      setPasswordModalError("");
      setIsPasswordModalOpen(true);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  /*
    يُستدعى من ConfirmPasswordModal بعد إدخال Current Password.
  */

    


async function handleConfirmEmail(currentPassword: string) {
  setIsEmailUpdating(true);
  setPasswordModalError("");

  try {
    const { user: updatedUser, message: serverMessage } =
      await updateEmail({
        currentPassword,
        email: pendingEmail,
        name: pendingProfileName,
      });

    dispatch(updateUser(updatedUser));

    setPendingEmail("");
    setPendingProfileName("");
    setIsPasswordModalOpen(false);
    setIsEditing(false);
    setMessage(serverMessage);
  } catch (error) {
    const requestMessage = getRequestErrorMessage(error);

    if (isDuplicateEmailError(error)) {
      setPasswordModalError("");
      setIsPasswordModalOpen(false);
      setEmailError(requestMessage);
      return;
    }

    setPasswordModalError(requestMessage);
  } finally {
    setIsEmailUpdating(false);
  }
}
function handleClosePasswordModal() {
  if (isEmailUpdating) {
    return;
  }

  setPasswordModalError("");
  setPendingEmail("");
  setPendingProfileName("");
  setIsPasswordModalOpen(false);
}

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and account details.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ProfileSidebar
            user={user}
            onImageChange={handleImageChange}
          />

          <ProfileForm
            initialValues={initialValues}
            isEditing={isEditing}
            isSaving={isSaving}
            message={message}
            errorMessage={errorMessage}
            emailError={emailError}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSubmit={handleProfileSubmit}
            onClearErrors={resetMessages}
          />
        </div>
      </div>

{isPasswordModalOpen && (
  <ConfirmPasswordModal
    title="Confirm your password"
    description="For your security, enter your current password before changing your email."
    isLoading={isEmailUpdating}
    errorMessage={passwordModalError}
    onClose={handleClosePasswordModal}
    onClearError={() => setPasswordModalError("")}
    onConfirm={handleConfirmEmail}
  />
)}
    </main>
  );
}

export default Profile;