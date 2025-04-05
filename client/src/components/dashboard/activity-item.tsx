import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  iconColor = 'text-primary',
  title,
  description,
  timestamp,
}) => {
  return (
    <li className="py-3 flex items-start gap-3">
      <div className={`mt-0.5 p-1.5 rounded ${iconColor.includes('text-') ? iconColor.replace('text-', 'bg-') + '/10' : 'bg-primary/10'}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{description}</p>}
      </div>
      {timestamp && <div className="text-xs text-muted-foreground whitespace-nowrap">{timestamp}</div>}
    </li>
  );
};

export default ActivityItem;