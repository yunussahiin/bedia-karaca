import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, BookmarkPlus, Share2, ThumbsUp } from "lucide-react";

interface BlogHeaderProps {
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  isApplauded: boolean;
  isBookmarked: boolean;
  metricsShares: number;
  metricsSaves: number;
  onApplaudToggle: () => void;
  onBookmarkToggle: () => void;
  onShare: () => void;
  shareFeedback: string | null;
}

export function BlogHeader({
  title,
  excerpt,
  category,
  authorName,
  isApplauded,
  isBookmarked,
  metricsShares,
  metricsSaves,
  onApplaudToggle,
  onBookmarkToggle,
  onShare,
  shareFeedback,
}: BlogHeaderProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
          {category}
        </Badge>
      </div>

      <h1
        className="text-4xl font-bold leading-tight text-foreground lg:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h1>
      <p className="text-lg leading-relaxed text-muted-foreground lg:text-xl">
        {excerpt}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border/60 bg-card/70 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback>
              {(authorName || "BK")
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">
              {authorName || "Bedia Kalemzer Karaca"}
            </p>
            <p className="text-sm text-muted-foreground">Klinik Psikolog1</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isApplauded ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={onApplaudToggle}
          >
            <ThumbsUp className="h-4 w-4" />
            {isApplauded ? "Teşekkürler" : `${metricsShares} Beğeni`}
          </Button>
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={onBookmarkToggle}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
            {isBookmarked ? "Kaydedildi" : `${metricsSaves} Kaydetme`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Paylaş
          </Button>
        </div>
      </div>

      {shareFeedback && (
        <div className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
          {shareFeedback}
        </div>
      )}
    </div>
  );
}
