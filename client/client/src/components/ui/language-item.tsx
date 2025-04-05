import { Language } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LanguageItemProps = {
  language: Language;
  isDefault: boolean;
  onToggleActive: (id: number, isActive: boolean) => void;
  onEdit: (language: Language) => void;
  onMakeDefault: (id: number) => void;
};

export default function LanguageItem({
  language,
  isDefault,
  onToggleActive,
  onEdit,
  onMakeDefault,
}: LanguageItemProps) {
  return (
    <li className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        {language.flagUrl ? (
          <img
            src={language.flagUrl}
            alt={language.name}
            className="h-5 w-8 object-cover mr-3"
          />
        ) : (
          <div className="h-5 w-8 bg-muted rounded mr-3 flex items-center justify-center text-xs">
            {language.code.toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">
            {language.name}
            {isDefault && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Varsayılan dil)
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Çeviri tamamlandı: %{language.translationProgress}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Badge
          variant={
            language.isActive
              ? language.translationProgress === 100
                ? "success"
                : "warning"
              : "outline"
          }
        >
          {language.isActive
            ? language.translationProgress === 100
              ? "Aktif"
              : "Kısmi"
            : "Pasif"}
        </Badge>
        <Button
          variant="link"
          size="sm"
          onClick={() => onToggleActive(language.id, !language.isActive)}
          disabled={isDefault}
        >
          {language.isActive ? "Devre Dışı Bırak" : "Etkinleştir"}
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => onEdit(language)}
          className="text-muted-foreground"
        >
          Düzenle
        </Button>
        {!isDefault && (
          <Button
            variant="link"
            size="sm"
            onClick={() => onMakeDefault(language.id)}
          >
            Varsayılan Yap
          </Button>
        )}
      </div>
    </li>
  );
}
