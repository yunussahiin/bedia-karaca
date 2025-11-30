"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";

export function BlogCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 dark:border-emerald-800 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30">
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/50 dark:bg-emerald-900/20" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-100/50 dark:bg-teal-900/20" />

      <div className="relative">
        <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
          Destek Almaya Hazır mısınız?
        </h3>
        <p className="text-emerald-700 dark:text-emerald-300 mb-6 max-w-md">
          Bu konuda veya benzer konularda profesyonel destek almak isterseniz,
          sizinle görüşmekten mutluluk duyarım.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/book-appointment">
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Calendar className="h-4 w-4" />
              Randevu Al
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
            >
              <MessageCircle className="h-4 w-4" />
              İletişime Geç
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
