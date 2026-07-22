import { Button, SimpleTooltip } from '@deenruv/react-ui-devkit';
import { ExternalLink } from 'lucide-react';

export type StorefrontActionPresentationState = { kind: 'ready'; url: string } | { kind: 'disabled'; tooltip: string };

interface StorefrontActionProps {
  label: string;
  state: StorefrontActionPresentationState;
}

export const StorefrontAction = ({ label, state }: StorefrontActionProps) => {
  if (state.kind === 'ready') {
    return (
      <Button asChild variant="secondary" size="sm">
        <a href={state.url} target="_blank" rel="noopener noreferrer" className="gap-2">
          <ExternalLink className="size-4" aria-hidden="true" />
          {label}
        </a>
      </Button>
    );
  }

  return (
    <SimpleTooltip content={state.tooltip}>
      <Button type="button" variant="secondary" size="sm" className="gap-2" disabled>
        <ExternalLink className="size-4" aria-hidden="true" />
        {label}
      </Button>
    </SimpleTooltip>
  );
};
