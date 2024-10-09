import { apiCall } from '@/graphql/client';
import { Button, Checkbox, Input, Label } from '@/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MinkoFeat from '../assets/minko_feat.jpeg';
import { MinkoLogo } from '@/components/MinkoLogo';

export const LoginScreen = () => {
  const { t } = useTranslation('common');

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    const rememberMe = (e.currentTarget.elements.namedItem('rememberMe') as HTMLInputElement).checked;
    const data = await apiCall()('mutation')({
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
    if (data.login.__typename !== 'CurrentUser') toast(data.login.message, {});
  };
  return (
    <div className="flex h-[100vh] w-[100vw] bg-background text-foreground">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <MinkoLogo />
            <form onSubmit={login} className="grid gap-4">
              <div className="grid gap-2">
                <Label className="select-none" htmlFor="email">
                  {t('userName')}
                </Label>
                <Input placeholder={t('userName')} name="username" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="select-none" htmlFor="password">
                    {t('password')}
                  </Label>
                </div>
                <Input placeholder={t('password')} type="password" name="password" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" name="rememberMe" />
                <label
                  htmlFor="rememberMe"
                  className="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('rememberMe')}
                </label>
              </div>
              <Button type="submit">{t('login')}</Button>
            </form>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute inset-0">
            <img src={MinkoFeat} alt="Image" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
