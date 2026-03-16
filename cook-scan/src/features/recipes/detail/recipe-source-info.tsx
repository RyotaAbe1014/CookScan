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
            <div className="from-section-header ring-section-header-border flex items-start gap-2 rounded-lg bg-linear-to-r to-white p-3 ring-1">
              <BookOpenIcon className="text-warning mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <span className="text-foreground font-semibold">本の名前</span>
                <p className="text-muted-foreground mt-1">{sourceInfo.sourceName}</p>
              </div>
            </div>
          )}
          {sourceInfo.pageNumber && (
            <div className="from-section-header ring-section-header-border flex items-start gap-2 rounded-lg bg-linear-to-r to-white p-3 ring-1">
              <DocumentIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <span className="text-foreground font-semibold">ページ番号</span>
                <p className="text-muted-foreground mt-1">{sourceInfo.pageNumber}</p>
              </div>
            </div>
          )}
          {sourceInfo.sourceUrl && (
            <div className="from-section-header ring-section-header-border flex items-start gap-2 rounded-lg bg-linear-to-r to-white p-3 ring-1">
              <LinkIcon className="text-accent-steps mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <span className="text-foreground font-semibold">参照URL</span>
                {isValidHttpUrl(sourceInfo.sourceUrl) ? (
                  <a
                    href={sourceInfo.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover mt-1 block truncate transition-colors hover:underline"
                  >
                    {sourceInfo.sourceUrl}
                  </a>
                ) : (
                  <p className="text-muted-foreground mt-1 truncate">{sourceInfo.sourceUrl}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
