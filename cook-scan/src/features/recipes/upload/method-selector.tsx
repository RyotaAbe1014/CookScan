import { CameraIcon } from '@/components/icons/camera-icon'
import { CheckSolidIcon } from '@/components/icons/check-solid-icon'
import { AdjustmentsIcon } from '@/components/icons/adjustments-icon'
import { DocumentTextIcon } from '@/components/icons/document-text-icon'
import { CheckCircleOutlineIcon } from '@/components/icons/check-circle-outline-icon'

type Props = {
  onSelect: (method: 'scan' | 'manual' | 'text-input') => void
}

export default function MethodSelector({ onSelect }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <button
        onClick={() => onSelect('scan')}
        className="group relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-card-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-primary-light to-secondary-light opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-xl bg-primary p-4 shadow-lg transition-transform group-hover:scale-110">
            <CameraIcon
              className="h-12 w-12 text-white"
            />
          </div>
          <h3 className="mt-4 text-xl font-bold text-foreground">
            画像からスキャン
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            料理本やレシピカードの写真を撮影して、自動でレシピを抽出します
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-primary/30">
              <CheckSolidIcon className="h-3.5 w-3.5" />
              推奨
            </span>
            <span className="inline-flex items-center rounded-lg bg-accent-steps-light px-3 py-1.5 text-xs font-medium text-accent-steps ring-1 ring-accent-steps">
              簡単
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect('text-input')}
        className="group relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-card-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-primary-light to-secondary-light opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-xl bg-linear-to-br from-primary to-secondary-hover p-4 shadow-lg transition-transform group-hover:scale-110">
            <AdjustmentsIcon
              className="h-12 w-12 text-white"
            />
          </div>
          <h3 className="mt-4 text-xl font-bold text-foreground">
            テキストからレシピを生成
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            テキストを入力することで、レシピを生成します
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-primary to-secondary-hover px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-primary/30">
              <CheckSolidIcon className="h-3.5 w-3.5" />
              推奨
            </span>
            <span className="inline-flex items-center rounded-lg bg-primary-light px-3 py-1.5 text-xs font-medium text-primary-hover ring-1 ring-primary-light">
              簡単
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect('manual')}
        className="group relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-card-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-muted to-muted opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-xl bg-linear-to-br from-muted-foreground to-muted-foreground p-4 shadow-lg transition-transform group-hover:scale-110">
            <DocumentTextIcon
              className="h-12 w-12 text-white"
            />
          </div>
          <h3 className="mt-4 text-xl font-bold text-foreground">
            手動で入力
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            レシピの詳細を一つずつ入力して、オリジナルレシピを作成します
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
            <CheckCircleOutlineIcon className="h-4 w-4" />
            詳細な編集が可能
          </div>
        </div>
      </button>
    </div>
  )
}
