import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/index.js";
import { useTranslation } from "@/hooks/useTranslation.js";
import {
  Activity,
  BarChart3,
  Database,
  LayoutDashboard,
  LineChart,
  PieChart,
  PlusCircle,
  Settings,
} from "lucide-react";
import React from "react";

export const WidgetsEmptyState: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card className="border-2 border-dashed bg-muted/40 col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <LayoutDashboard className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="text-xl flex items-center justify-center min-h-[100px]">
            {t("widgets.emptyState")}
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed bg-muted/40 col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <BarChart3 className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[100px] text-center">
            <p className="text-muted-foreground">
              {t("widgets.emptyStateDescription")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="border-2 border-dashed bg-muted/40">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <LineChart className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[100px] text-center">
            <p className="text-muted-foreground">
              {t("widgets.emptyStateDescription2")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed bg-muted/40">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <PieChart className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[100px]">
            <div className="w-full space-y-2">
              <div className="h-2 bg-muted-foreground/20 rounded"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-4/5"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="border-2 border-dashed bg-muted/40">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <Activity className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="min-h-[100px] flex items-center justify-center">
            <div className="w-full h-24 px-2">
              <div className="flex items-end h-full gap-1">
                {Array.from({ length: 14 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 20;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-muted-foreground/20 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed bg-muted/40">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <Database className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="min-h-[100px] flex items-center justify-center">
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-muted-foreground/20"></div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-muted-foreground/20"></div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-muted-foreground/20"></div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed bg-muted/40">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <Settings className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="min-h-[100px] flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M 10,50 A 40,40 0 1,1 90,50"
                  fill="none"
                  stroke="hsl(var(--muted-foreground) / 0.1)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 10,50 A 40,40 0 0,1 50,10"
                  fill="none"
                  stroke="hsl(var(--muted-foreground) / 0.2)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40">
                65%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
