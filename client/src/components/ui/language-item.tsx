import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Globe, Check, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type LanguageItemProps = {
  language: {
    id: number;
    name: string;
    code: string;
    flagUrl: string | null;
    isActive: boolean;
    isDefault: boolean;
    translationProgress: number;
  };
  isDefault: boolean;
  onToggleActive: (id: number, isActive: boolean) => void;
  onEdit: (language: any) => void;
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
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {language.flagUrl ? (
            <img 
              src={language.flagUrl}
              alt={`${language.name} flag`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Globe className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium">{language.name}</span>
            {isDefault && (
              <Badge variant="secondary" className="ml-2 px-2 py-0 h-5">
                Varsayılan
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground flex items-center space-x-2">
            <span className="uppercase">{language.code}</span>
            <span>•</span>
            <span>Çeviri: %{language.translationProgress}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center mr-2">
          <Switch
            checked={language.isActive}
            onCheckedChange={(checked) => onToggleActive(language.id, checked)}
            disabled={isDefault}
          />
          <span className="ml-2 text-sm">
            {language.isActive ? 'Aktif' : 'Pasif'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(language)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Düzenle
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isDefault && (
              <DropdownMenuItem onClick={() => onMakeDefault(language.id)}>
                <Check className="h-4 w-4 mr-2" />
                Varsayılan Yap
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}