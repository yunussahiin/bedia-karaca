"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  Brain,
  AlertTriangle,
  Phone,
  BookOpen,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ExpertNoteTemplates } from "./expert-note-templates";
import { ManageEditableItemsModal } from "./manage-editable-items-modal";
import { ManageAuthorProfilesModal } from "./manage-author-profiles-modal";
import { ManageDifficultyLevelsModal } from "./manage-difficulty-levels-modal";
import { ManageFAQModal } from "./manage-faq-modal";
import {
  ManageDisclaimerContentModal,
  DEFAULT_DISCLAIMER_CONTENT,
} from "./manage-disclaimer-content-modal";

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

interface AuthorProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  isDefault?: boolean;
}

interface DifficultyLevelItem {
  id: string;
  name: string;
  label: string;
  color: string;
  description: string;
  isDefault?: boolean;
}

interface DisclaimerContent {
  disclaimer: string;
  crisisInfo: string;
}

interface BlogPsychologySettingsProps {
  expertNote: string;
  setExpertNote: (value: string) => void;
  authorBio: string;
  setAuthorBio: (value: string) => void;
  authorAvatar: string;
  setAuthorAvatar: (value: string) => void;
  difficultyLevel: DifficultyLevel;
  setDifficultyLevel: (value: DifficultyLevel) => void;
  emotionTags: string[];
  setEmotionTags: (value: string[]) => void;
  relatedConditions: string[];
  setRelatedConditions: (value: string[]) => void;
  showDisclaimer: boolean;
  setShowDisclaimer: (value: boolean) => void;
  showCrisisInfo: boolean;
  setShowCrisisInfo: (value: boolean) => void;
  disclaimerText: string;
  setDisclaimerText: (value: string) => void;
  crisisInfoText: string;
  setCrisisInfoText: (value: string) => void;
  faq: Array<{ id: string; question: string; answer: string }>;
  setFAQ: (
    value: Array<{ id: string; question: string; answer: string }>
  ) => void;
}

// Varsayılan seçenekler
const DEFAULT_EMOTIONS = [
  "Kaygı",
  "Üzüntü",
  "Öfke",
  "Korku",
  "Utanç",
  "Suçluluk",
  "Yalnızlık",
  "Umutsuzluk",
];

const DEFAULT_CONDITIONS = [
  "DEHB",
  "Depresyon",
  "Sosyal Anksiyete",
  "TSSB",
  "OKB",
  "Panik Bozukluk",
  "Yaygın Anksiyete",
  "Bipolar",
];

// Varsayılan profil - avatars bucket'ından
const DEFAULT_AVATAR_URL =
  "https://nztcblkytmaxartdvhoj.supabase.co/storage/v1/object/public/avatars/author-1764449943538.jpg";

const DEFAULT_PROFILES: AuthorProfile[] = [
  {
    id: "bedia-karaca",
    name: "Bedia Kalemzer Karaca",
    bio: "Klinik Psikolog",
    avatar: DEFAULT_AVATAR_URL,
    isDefault: true,
  },
];

const DEFAULT_DIFFICULTY_LEVELS: DifficultyLevelItem[] = [
  {
    id: "beginner",
    name: "beginner",
    label: "Başlangıç",
    color: "bg-green-500",
    description: "Genel okuyucu",
    isDefault: true,
  },
  {
    id: "intermediate",
    name: "intermediate",
    label: "Orta Seviye",
    color: "bg-amber-500",
    description: "Temel bilgi gerektirir",
    isDefault: true,
  },
  {
    id: "advanced",
    name: "advanced",
    label: "İleri Seviye",
    color: "bg-red-500",
    description: "Profesyoneller için",
    isDefault: true,
  },
];

interface TooltipLabelProps {
  label: string;
  tooltip: string;
  icon?: LucideIcon;
}

function TooltipLabel({ label, tooltip, icon: Icon }: TooltipLabelProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px]">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function BlogPsychologySettings({
  expertNote,
  setExpertNote,
  authorBio,
  setAuthorBio,
  authorAvatar,
  setAuthorAvatar,
  difficultyLevel,
  setDifficultyLevel,
  emotionTags,
  setEmotionTags,
  relatedConditions,
  setRelatedConditions,
  showDisclaimer,
  setShowDisclaimer,
  showCrisisInfo,
  setShowCrisisInfo,
  disclaimerText,
  setDisclaimerText,
  crisisInfoText,
  setCrisisInfoText,
  faq,
  setFAQ,
}: BlogPsychologySettingsProps) {
  const [emotions, setEmotions] = useState(DEFAULT_EMOTIONS);
  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS);
  const [profiles, setProfiles] = useState<AuthorProfile[]>(DEFAULT_PROFILES);
  const [difficultyLevels, setDifficultyLevels] = useState<
    DifficultyLevelItem[]
  >(DEFAULT_DIFFICULTY_LEVELS);

  // Disclaimer içeriğini props'tan al, yoksa varsayılan kullan
  const disclaimerContent: DisclaimerContent = {
    disclaimer: disclaimerText || DEFAULT_DISCLAIMER_CONTENT.disclaimer,
    crisisInfo: crisisInfoText || DEFAULT_DISCLAIMER_CONTENT.crisisInfo,
  };

  const handleDisclaimerContentChange = (content: DisclaimerContent) => {
    setDisclaimerText(content.disclaimer);
    setCrisisInfoText(content.crisisInfo);
  };

  const selectedProfile =
    profiles.find((p) => p.avatar === authorAvatar) || profiles[0];

  const addEmotionTag = (tag: string) => {
    if (tag && !emotionTags.includes(tag)) {
      setEmotionTags([...emotionTags, tag]);
      toast.success(`"${tag}" etiketi eklendi`);
    }
  };

  const removeEmotionTag = (tag: string) => {
    setEmotionTags(emotionTags.filter((t) => t !== tag));
    toast.success(`"${tag}" etiketi kaldırıldı`);
  };

  const addCondition = (condition: string) => {
    if (condition && !relatedConditions.includes(condition)) {
      setRelatedConditions([...relatedConditions, condition]);
      toast.success(`"${condition}" durumu eklendi`);
    }
  };

  const removeCondition = (condition: string) => {
    setRelatedConditions(relatedConditions.filter((c) => c !== condition));
    toast.success(`"${condition}" durumu kaldırıldı`);
  };

  const handleProfileSelect = (profile: AuthorProfile) => {
    setAuthorAvatar(profile.avatar);
    setAuthorBio(profile.bio);
    toast.success(`"${profile.name}" profili seçildi`);
  };

  return (
    <div className="space-y-5">
      {/* Uzman Notu */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="flex items-center gap-1.5">
            <TooltipLabel
              label="Uzman Notu"
              tooltip="Yazının sonunda görünecek kişisel yorumunuz. Okuyucuya özel bir mesaj veya özet içerebilir."
              icon={Brain}
            />
          </Label>
          <ExpertNoteTemplates
            onSelect={setExpertNote}
            currentNote={expertNote}
          />
        </div>
        <Textarea
          placeholder="Yazının sonunda görünecek uzman yorumunuz..."
          value={expertNote}
          onChange={(e) => setExpertNote(e.target.value)}
          rows={3}
          className="text-sm"
        />
      </div>

      {/* Yazar Profili */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label>
            <TooltipLabel
              label="Yazar Profili"
              tooltip="Uzman notu altında görünecek profil resmi ve unvan."
            />
          </Label>
          <ManageAuthorProfilesModal
            profiles={profiles}
            onProfilesChange={setProfiles}
          />
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleProfileSelect(profile)}
              className={`relative rounded-full overflow-hidden ring-2 transition-all h-12 w-12 ${
                authorAvatar === profile.avatar
                  ? "ring-primary ring-offset-2"
                  : "ring-transparent hover:ring-muted-foreground/30"
              }`}
            >
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
          <div className="flex-1 ml-2">
            <p className="text-sm font-medium">{selectedProfile?.name}</p>
            <p className="text-xs text-muted-foreground">{authorBio}</p>
          </div>
        </div>
      </div>

      {/* Zorluk Seviyesi */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label>
            <TooltipLabel
              label="Zorluk Seviyesi"
              tooltip="İçeriğin teknik derinliğini belirtir."
              icon={BookOpen}
            />
          </Label>
          <ManageDifficultyLevelsModal
            levels={difficultyLevels}
            onLevelsChange={setDifficultyLevels}
          />
        </div>
        <Select
          value={difficultyLevel}
          onValueChange={(value) =>
            setDifficultyLevel(value as DifficultyLevel)
          }
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {difficultyLevels.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${level.color}`} />
                  {level.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duygu Etiketleri */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label>
            <TooltipLabel
              label="Duygu Etiketleri"
              tooltip="Yazının ele aldığı temel duygular. Okuyucuların ilgili içerikleri bulmasına yardımcı olur."
            />
          </Label>
          <ManageEditableItemsModal
            title="Duygu Etiketlerini Yönet"
            description="Duygu etiketlerini ekleyin, düzenleyin veya silin."
            items={emotions}
            onItemsChange={setEmotions}
            placeholder="Yeni duygu ekle..."
          />
        </div>
        {emotionTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {emotionTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeEmotionTag(tag)}
                  className="ml-1 hover:text-amber-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Select onValueChange={addEmotionTag}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Duygu seçin..." />
          </SelectTrigger>
          <SelectContent>
            {emotions
              .filter((e) => !emotionTags.includes(e))
              .map((emotion) => (
                <SelectItem key={emotion} value={emotion}>
                  {emotion}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* İlişkili Durumlar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label>
            <TooltipLabel
              label="İlişkili Durumlar"
              tooltip="Yazının ilgili olduğu psikolojik durumlar veya tanılar."
            />
          </Label>
          <ManageEditableItemsModal
            title="İlişkili Durumları Yönet"
            description="Psikolojik durumları ekleyin, düzenleyin veya silin."
            items={conditions}
            onItemsChange={setConditions}
            placeholder="Yeni durum ekle..."
          />
        </div>
        {relatedConditions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {relatedConditions.map((condition) => (
              <Badge
                key={condition}
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs"
              >
                {condition}
                <button
                  type="button"
                  onClick={() => removeCondition(condition)}
                  className="ml-1 hover:text-purple-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Select onValueChange={addCondition}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Durum seçin..." />
          </SelectTrigger>
          <SelectContent>
            {conditions
              .filter((c) => !relatedConditions.includes(c))
              .map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Uyarılar */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Uyarı Ayarları</Label>
          <ManageDisclaimerContentModal
            content={disclaimerContent}
            onContentChange={handleDisclaimerContentChange}
          />
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="showDisclaimer"
            checked={showDisclaimer}
            onCheckedChange={(checked) => setShowDisclaimer(checked as boolean)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label
              htmlFor="showDisclaimer"
              className="cursor-pointer text-sm flex items-center gap-1.5"
            >
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Tıbbi uyarı notu göster
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {disclaimerContent.disclaimer.substring(0, 80)}...
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="showCrisisInfo"
            checked={showCrisisInfo}
            onCheckedChange={(checked) => setShowCrisisInfo(checked as boolean)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label
              htmlFor="showCrisisInfo"
              className="cursor-pointer text-sm flex items-center gap-1.5"
            >
              <Phone className="h-4 w-4 text-red-500" />
              Kriz hattı bilgisi göster
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {disclaimerContent.crisisInfo.substring(0, 80)}...
            </p>
          </div>
        </div>
      </div>

      {/* Sıkça Sorulan Sorular */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            Sıkça Sorulan Sorular
          </Label>
          <ManageFAQModal faq={faq} onFAQChange={setFAQ} />
        </div>
        {faq.length > 0 ? (
          <div className="space-y-2">
            {faq.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="text-sm p-2 rounded-lg bg-muted/50 flex items-center gap-2"
              >
                <span className="text-xs font-medium text-muted-foreground w-5">
                  {index + 1}.
                </span>
                <span className="truncate flex-1">{item.question}</span>
              </div>
            ))}
            {faq.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{faq.length - 3} soru daha
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
            Henüz SSS eklenmemiş
          </p>
        )}
      </div>
    </div>
  );
}
