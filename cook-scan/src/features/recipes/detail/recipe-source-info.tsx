import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { SourceInfoDisplay } from "@/types/sourceInfo";
import { isValidHttpUrl } from "@/utils/url-validation";
import { BookOpenIcon } from "@/components/icons/book-open-icon";
import { DocumentIcon } from "@/components/icons/document-icon";
import { LinkIcon } from "@/components/icons/link-icon";

type RecipeSourceInfoProps = {
  sourceInfo: SourceInfoDisplay;
};

export function RecipeSourceInfo({ sourceInfo }: RecipeSourceInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader
        icon={<BookOpenIcon className="h-5 w-5 text-white" />}
        iconColor="accent-tags"
        title="ソース情報"
      />
      <CardContent>
        <div className="space-y-3 text-sm">
          {sourceInfo.sourceName && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-section-header to-white p-3 ring-1 ring-section-header-border">
              <BookOpenIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-foreground">本の名前</span>
                <p className="mt-1 text-muted-foreground">{sourceInfo.sourceName}</p>
              </div>
            </div>
          )}
          {sourceInfo.pageNumber && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-section-header to-white p-3 ring-1 ring-section-header-border">
              <DocumentIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                <span className="font-semibold text-foreground">ページ番号</span>
                <p className="mt-1 text-muted-foreground">{sourceInfo.pageNumber}</p>
              </div>
            </div>
          )}
          {sourceInfo.sourceUrl && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-section-header to-white p-3 ring-1 ring-section-header-border">
              <LinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-steps" />
              <div className="flex-1 overflow-hidden">
                <span className="font-semibold text-foreground">参照URL</span>
                {isValidHttpUrl(sourceInfo.sourceUrl) ? (
                  <a
                    href={sourceInfo.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-primary transition-colors hover:text-primary-hover hover:underline"
                  >
                    {sourceInfo.sourceUrl}
                  </a>
                ) : (
                  <p className="mt-1 truncate text-muted-foreground">{sourceInfo.sourceUrl}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
