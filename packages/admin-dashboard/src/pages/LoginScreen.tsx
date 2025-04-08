import { Aexol } from '@/components';
import { BrandLogo } from '@/components/BrandLogo';

import { Button, Checkbox, Input, useTranslation, apiClient, cn } from '@deenruv/react-ui-devkit';
import React from 'react';
import { toast } from 'sonner';

export const LoginScreen = () => {
  const { t } = useTranslation('common');
  const showAppVersion = window.__DEENRUV_SETTINGS__.branding.showAppVersion;
  const [error, setError] = React.useState<string | null>(null);

  const image =
    window.__DEENRUV_SETTINGS__.branding.loginPage?.logo ||
    'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg';
  const hideFormLogo = window.__DEENRUV_SETTINGS__.branding.loginPage?.hideFormLogo || false;
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    const rememberMe = (e.currentTarget.elements.namedItem('rememberMe') as HTMLInputElement).checked;
    const data = await apiClient('mutation')({
      login: [
        { username, password, rememberMe },
        {
          __typename: true,
          '...on CurrentUser': { id: true },
          '...on InvalidCredentialsError': { message: true },
          '...on NativeAuthStrategyError': { message: true },
        },
      ],
    });
    if (data.login.__typename !== 'CurrentUser') {
      setError(data.login.message);
      toast(data.login.message, {});
    }
  };
  return (
    <div className="bg-background text-foreground flex h-screen w-screen">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            {hideFormLogo ? null : (
              <div className="flex h-[100px] items-center justify-center">
                <BrandLogo />
              </div>
            )}
            <form onSubmit={login} className="grid gap-4">
              <Input label={t('userName')} placeholder={t('userName')} name="username" />
              <Input label={t('password')} placeholder={t('password')} type="password" name="password" />
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" name="rememberMe" />
                <label
                  htmlFor="rememberMe"
                  className="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('rememberMe')}
                </label>
              </div>
              <div className="h-4">
                <p className="text-sm text-red-500">{error}</p>
              </div>
              <Button type="submit">{t('login')}</Button>
            </form>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          {image && typeof image === 'string' ? (
            <img
              src={image}
              alt="Image for login screen"
              width="1920"
              height="1080"
              className="pointer-events-none size-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          ) : image && typeof image !== 'string' ? (
            <div className="size-full bg-gradient-to-t from-black to-transparent dark:from-black/50 dark:to-transparent">
              {image}
            </div>
          ) : null}
          <div className="absolute bottom-0 right-0 bg-gradient-to-t from-black to-transparent p-6 dark:from-black/50 dark:to-transparent">
            <h1 className="mb-2 select-none text-3xl font-bold text-white">{t('welcome')}</h1>
            <div
              className={cn(
                `mt-4 flex select-none items-center gap-2`,
                showAppVersion ? 'justify-between' : 'justify-end',
              )}
            >
              {showAppVersion ? (
                <p className="text-xs text-white">Deenruv v.{window.__DEENRUV_SETTINGS__.appVersion}</p>
              ) : null}
              <Aexol text={t('poweredBy')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
