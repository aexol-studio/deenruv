import React from "react";
import { useTranslation } from "react-i18next";
import { translationNS } from "../translation-ns";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Label,
  useMutation,
  useQuery,
} from "@deenruv/react-ui-devkit";
import { ProductsQuery } from "../graphql/queries";
import { ProductMutation } from "../graphql/mutations";
import { useForm } from "react-hook-form";
import { FromSelectorWithScalars, LanguageCode } from "@deenruv/admin-types";
import { ProductsSelector } from "../graphql/selectors";
import { toast } from "sonner";

type ProductType = FromSelectorWithScalars<typeof ProductsSelector, "Product">;

export const LocaleTest = () => {
  const { t } = useTranslation(translationNS);

  const [updateProduct] = useMutation(ProductMutation);
  const { data: productsData } = useQuery(ProductsQuery, {
    initialVariables: { take: 3 },
    onSuccess: ({ products }) => reset({ products: products?.items }),
  });
  const products = productsData?.products?.items || [];

  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm<{ products: Array<ProductType> }>();
  return (
    <Card>
      <CardHeader>
        <h1 className="mb-2 text-3xl font-bold">{t("heading")}</h1>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(async (data) => {
            const productsToUpdate = data.products.filter((el) => {
              const foundProduct = products?.find((el2) => el.id === el2.id);

              return foundProduct?.slug !== el.slug;
            });

            await Promise.all(
              productsToUpdate.map((el) =>
                updateProduct({
                  input: {
                    id: el.id,
                    translations: [
                      { languageCode: LanguageCode.en, slug: el.slug },
                    ],
                  },
                }),
              ),
            );
            toast.success("success!");
          })}
        >
          <p className="mb-4">{t("text")}</p>
          <p className="mb-4 font-bold">Products List</p>
          <div className="flex flex-col gap-2">
            {products?.map((el, idx) => (
              <div key={el.id}>
                <div className="mb-2 flex items-center gap-4">
                  <p>
                    {el.id}. {el.name}
                  </p>
                  <div>
                    <Label>product slug</Label>
                    <Input {...register(`products.${idx}.slug`)} />
                  </div>
                </div>
                <div>{el.description}</div>
              </div>
            ))}
          </div>
          <Button type="submit">Update</Button>
        </form>
      </CardContent>
    </Card>
  );
};
