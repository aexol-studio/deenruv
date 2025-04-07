import { GraphQLError } from "graphql";
import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "./useTranslation.js";

export function useErrorHandler() {
  const { t } = useTranslation("common");

  const parseError = useCallback(
    (errorMessage: string) => {
      const errorParsers: {
        [key: string]: (msg: string, t: any) => string | null;
      } = {
        "violates foreign key constraint": parseForeignKeyError,
        // other errors...
      };

      for (const key in errorParsers) {
        if (errorMessage.includes(key)) {
          return errorParsers[key](errorMessage, t);
        }
      }

      return t("globalErrors.defaultError");
    },
    [t],
  );

  const handleError = (errors: GraphQLError[]) => {
    const errorMessage = errors[0].message;

    if (typeof errorMessage === "string") {
      const message = parseError(errorMessage);
      toast.error(message);
    }
  };

  return { handleError };
}

function parseForeignKeyError(
  errorMessage: string,
  t: (key: string, params?: any) => string,
): string | null {
  const match = errorMessage.match(
    /update or delete on table \"(\w+)\" violates foreign key constraint \".*\" on table \"(\w+)\"/,
  );

  if (match) {
    const [_, parentTable, dependentTable] = match;
    return t("globalErrors.foreignKeyError", { parentTable, dependentTable });
  }

  return null;
}
