import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
  icon: LucideIcon;
  text: string;
  href: string;
  iconColor?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  text,
  href,
  iconColor = 'text-primary'
}) => {
  return (
    <Link href={href}>
      <a className="block w-full">
        <Button variant="outline" className="w-full h-auto py-4 px-3 justify-start">
          <div className="flex flex-col items-center text-center w-full gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <span className="text-xs font-medium">{text}</span>
          </div>
        </Button>
      </a>
    </Link>
  );
};

export default QuickActionButton;