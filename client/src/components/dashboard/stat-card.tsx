import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  footerText?: string;
  footerLink?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  footerText,
  footerLink
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className={`p-2 rounded-md ${iconBgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
      {footerText && (
        <CardFooter className="py-2 border-t">
          {footerLink ? (
            <Link href={footerLink}>
              <a className="text-xs text-primary font-medium hover:underline">
                {footerText}
              </a>
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">{footerText}</span>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default StatCard;