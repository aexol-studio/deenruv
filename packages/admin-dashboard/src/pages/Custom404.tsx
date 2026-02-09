import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Menu } from '@/components';
import { Button } from '@deenruv/react-ui-devkit';
import { ArrowLeft, AlertTriangle, FileQuestion } from 'lucide-react';

export const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  if (is404) {
    return (
      <div className="flex max-h-screen w-full max-w-full overflow-hidden bg-background text-foreground">
        <Menu>
          <div className="flex size-full flex-1 flex-col items-center justify-center overflow-y-auto p-4 pt-6 md:p-8">
            <FileQuestion className="mb-4 size-16 text-muted-foreground" />
            <h1 className="mb-2 text-4xl font-bold">404</h1>
            <p className="mb-6 text-lg text-muted-foreground">Page not found</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 size-4" />
                Go back
              </Button>
              <Button onClick={() => navigate('/admin-ui/')}>Go to Dashboard</Button>
            </div>
          </div>
        </Menu>
      </div>
    );
  }

  // Runtime error - show dev-friendly details
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <div className="flex max-h-screen w-full max-w-full overflow-hidden bg-background text-foreground">
      <Menu>
        <div className="flex size-full flex-1 flex-col overflow-y-auto p-4 pt-6 md:p-8">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <AlertTriangle className="size-8 text-destructive" />
              <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>

            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="font-mono text-sm text-destructive">{errorMessage}</p>
            </div>

            {errorStack && (
              <details className="mb-6">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Stack trace
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs whitespace-pre-wrap">
                  {errorStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 size-4" />
                Go back
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload page
              </Button>
              <Button onClick={() => navigate('/admin-ui/')}>Go to Dashboard</Button>
            </div>
          </div>
        </div>
      </Menu>
    </div>
  );
};

// Keep backward compat export name
export const Custom404 = ErrorPage;
