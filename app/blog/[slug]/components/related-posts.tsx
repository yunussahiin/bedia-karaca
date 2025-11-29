import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPost } from "@/app/blog/data";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2
        className="text-3xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        İlgili Yazılar
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group h-full border-border/60 bg-card/80 transition hover:border-primary/40 hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="rounded-full">
                  {post.category}
                </Badge>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{post.readTime}</span>
              </div>
              <CardTitle className="text-xl leading-tight group-hover:text-primary">
                {post.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link href={`/blog/${post.slug}`}>
                  Devamını Oku
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
