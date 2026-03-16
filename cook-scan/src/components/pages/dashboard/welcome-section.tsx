type Profile = {
  name: string | null;
  email: string;
};

type WelcomeSectionProps = {
  profile: Profile;
};

export function WelcomeSection({ profile }: WelcomeSectionProps) {
  const displayName = profile.name || "ゲスト";

  return (
    <div className="mb-8">
      <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
        こんにちは、{displayName}さん
      </h2>
      <p className="text-muted-foreground mt-1">今日は何を料理しますか？</p>
    </div>
  );
}
