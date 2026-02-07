import { Menu } from '@/components';

export const Custom404 = () => {
  return (
    <div className="flex max-h-screen w-full max-w-full overflow-hidden bg-background text-foreground">
      <Menu>
        <div className="flex size-full flex-1 flex-col overflow-y-auto p-4 pt-6 md:p-8">
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      </Menu>
    </div>
  );
};
