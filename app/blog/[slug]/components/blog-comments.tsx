"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MessageCircle,
  Send,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  getApprovedComments,
  createComment,
  type BlogComment,
} from "@/lib/services/comments";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const commentSchema = z.object({
  author_name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(100, "İsim en fazla 100 karakter olabilir"),
  author_email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  content: z
    .string()
    .min(10, "Yorum en az 10 karakter olmalıdır")
    .max(2000, "Yorum en fazla 2000 karakter olabilir"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface BlogCommentsProps {
  postId: string;
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      author_name: "",
      author_email: "",
      content: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      setLoading(true);
      const data = await getApprovedComments(postId);
      if (isMounted) {
        setComments(data);
        setLoading(false);
      }
    };

    fetchComments();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const onSubmit = async (values: CommentFormValues) => {
    setSubmitting(true);

    const result = await createComment({
      post_id: postId,
      ...values,
    });

    if (result.success) {
      toast.success("Yorumunuz gönderildi!", {
        description: "Yorumunuz onaylandıktan sonra yayınlanacaktır.",
      });
      form.reset();
      setSubmitted(true);
    } else {
      toast.error("Hata", {
        description: result.error || "Yorum gönderilemedi",
      });
    }

    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Yorum Formu veya Başarı Mesajı */}
      {submitted ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Yorumunuz Başarıyla Gönderildi!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 max-w-md">
                Yorumunuz incelenmek üzere alındı. Onaylandıktan sonra bu
                sayfada yayınlanacaktır.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300"
                onClick={() => setSubmitted(false)}
              >
                Yeni Yorum Yaz
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 bg-card/70">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="h-5 w-5 text-primary" />
              Yorum Yaz
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Bu yazı hakkında düşüncelerinizi paylaşın
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="author_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İsim</FormLabel>
                        <FormControl>
                          <Input placeholder="Adınız Soyadınız" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ornek@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yorumunuz</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bu yazı hakkında düşüncelerinizi paylaşın..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Yorumunuz onaylandıktan sonra yayınlanacaktır.
                  </p>
                  <Button type="submit" disabled={submitting} className="gap-2">
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Gönder
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Yorumlar Listesi */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <MessageCircle className="h-5 w-5 text-primary" />
          Yorumlar
          {!loading && comments.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/60 bg-card/70">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <Card className="border-border/60 bg-card/70">
            <CardContent className="py-12 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card
                key={comment.id}
                className="border-border/60 bg-card/70 transition-colors hover:bg-card/90"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border border-border/60">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(comment.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          {comment.author_name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
