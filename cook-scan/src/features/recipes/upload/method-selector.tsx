import { CameraIcon } from "@/components/icons/camera-icon";
import { CheckSolidIcon } from "@/components/icons/check-solid-icon";
import { AdjustmentsIcon } from "@/components/icons/adjustments-icon";
import { DocumentTextIcon } from "@/components/icons/document-text-icon";
import { CheckCircleOutlineIcon } from "@/components/icons/check-circle-outline-icon";

type Props = {
  onSelect: (method: "scan" | "manual" | "text-input") => void;
};

export default function MethodSelector({ onSelect }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <button
        onClick={() => onSelect("scan")}
        className="group ring-card-border relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="from-primary-light to-secondary-light absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="bg-primary rounded-xl p-4 shadow-lg transition-transform group-hover:scale-110">
            <CameraIcon className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-foreground mt-4 text-xl font-bold">画像からスキャン</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            料理本やレシピカードの写真を撮影して、自動でレシピを抽出します
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-primary shadow-primary/30 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-md">
              <CheckSolidIcon className="h-3.5 w-3.5" />
              推奨
            </span>
            <span className="bg-accent-steps-light text-accent-steps ring-accent-steps inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium ring-1">
              簡単
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect("text-input")}
        className="group ring-card-border relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="from-primary-light to-secondary-light absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="from-primary to-secondary-hover rounded-xl bg-linear-to-br p-4 shadow-lg transition-transform group-hover:scale-110">
            <AdjustmentsIcon className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-foreground mt-4 text-xl font-bold">テキストからレシピを生成</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            テキストを入力することで、レシピを生成します
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="from-primary to-secondary-hover shadow-primary/30 inline-flex items-center gap-1 rounded-lg bg-linear-to-r px-3 py-1.5 text-xs font-semibold text-white shadow-md">
              <CheckSolidIcon className="h-3.5 w-3.5" />
              推奨
            </span>
            <span className="bg-primary-light text-primary-hover ring-primary-light inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium ring-1">
              簡単
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect("manual")}
        className="group ring-card-border relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="from-muted to-muted absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="from-muted-foreground to-muted-foreground rounded-xl bg-linear-to-br p-4 shadow-lg transition-transform group-hover:scale-110">
            <DocumentTextIcon className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-foreground mt-4 text-xl font-bold">手動で入力</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            レシピの詳細を一つずつ入力して、オリジナルレシピを作成します
          </p>
          <div className="text-foreground mt-4 inline-flex items-center gap-1 text-sm font-medium">
            <CheckCircleOutlineIcon className="h-4 w-4" />
            詳細な編集が可能
          </div>
        </div>
      </button>
    </div>
  );
}
