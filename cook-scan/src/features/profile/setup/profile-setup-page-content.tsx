import { ProfileSetupHeader } from "./profile-setup-header";
import ProfileSetupForm from "./profile-setup-form";

type ProfileSetupPageContentProps = {
  userId: string;
  userEmail: string;
};

export function ProfileSetupPageContent({ userId, userEmail }: ProfileSetupPageContentProps) {
  return (
    <div className="from-primary-light to-secondary-light flex min-h-screen flex-col items-center justify-center bg-linear-to-br via-white p-4">
      <div className="w-full max-w-md space-y-8">
        <ProfileSetupHeader />
        <div className="ring-card-border overflow-hidden rounded-2xl bg-white shadow-xl ring-1">
          <ProfileSetupForm userId={userId} userEmail={userEmail} />
        </div>
      </div>
    </div>
  );
}
