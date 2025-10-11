import type { TaskStatus } from '@/lib/types';
import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export const StatusIcon = ({ status, ...props }: { status: TaskStatus } & LucideProps) => {
  switch (status) {
    case 'Todo':
      return <Circle {...props} />;
    case 'In Progress':
      return <CircleDot {...props} />;
    case 'Done':
      return <CheckCircle2 {...props} />;
    default:
      return null;
  }
};
