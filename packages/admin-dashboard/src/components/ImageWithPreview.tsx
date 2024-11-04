import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
interface Props
  extends Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'className'> {
  imageClassName?: string;
  previewClassName?: string;
}

export const ImageWithPreview: React.FC<Props> = ({ imageClassName, previewClassName, src, ...props }) => (
  <HoverCard>
    <HoverCardTrigger className="cursor-pointer" asChild>
      <img className={cn('h-14 w-14', imageClassName)} src={src || 'placeholder'} {...props} />
    </HoverCardTrigger>
    <HoverCardContent className={cn('w-80 rounded border p-0', previewClassName)}>
      <img className="object-cover" src={src || 'placeholder'} {...props} />
    </HoverCardContent>
  </HoverCard>
);
