import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageBlock,
  Textarea,
  useLazyQuery,
  useQuery,
  Label,
  Badge,
  Separator,
  formatDate,
  Button,
  useMutation,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  DialogClose,
  ImageWithPreview,
  Routes,
} from "@deenruv/react-ui-devkit";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChangeReviewStateMutation,
  GetReviewQuery,
  GetReviewsConfigQuery,
  ReviewDetail,
  UpdateTranslationsReviewMutation,
  TranslateReviewsQuery,
} from "../graphql";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Mail, Star, User } from "lucide-react";
import { LanguageCode, ReviewState } from "../zeus";
import { useNavigate } from "react-router-dom";
import { OrderInfo, ProductInfo } from "../components";
import { TRANSLATION_NAMESPACE } from "../constants";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ReviewStateChange } from "../components/ReviewStateChange";

export const Review = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const { id } = useParams();
  const { data: config } = useQuery(GetReviewsConfigQuery);
  const [get] = useLazyQuery(GetReviewQuery);
  const [originalReview, setOriginalReview] = useState<ReviewDetail>();
  const [review, setReview] = useState<ReviewDetail>();
  const [updateTranslationsReview] = useMutation(
    UpdateTranslationsReviewMutation,
  );
  const [changeReviewState] = useMutation(ChangeReviewStateMutation);
  const [translate] = useLazyQuery(TranslateReviewsQuery);
  const navigate = useNavigate();

  const refetch = useCallback(async () => {
    if (!id) return;
    try {
      const res = await get({ id });
      setReview(res.getReview);
      setOriginalReview(res.getReview);
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  }, [id]);

  useEffect(() => {
    if (config && id) refetch();
  }, [id, config]);

  const getStateColor = (state: string | undefined) => {
    let variant: "default" | "success" | "destructive" = "default";
    if (state === ReviewState.ACCEPTED) {
      variant = "success";
    }
    if (state === ReviewState.DECLINED) {
      variant = "destructive";
    }
    return variant;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
        fill={i < rating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
      />
    ));
  };

  const handleGenerateAllMissingTranslations = async () => {
    if (!review || !config) return;
    try {
      const languages = config.getReviewsConfig.reviewsLanguages;
      const existingLanguages = review.translations.map((t) => t.languageCode);
      const missingLanguages = languages.filter(
        (lang) => !existingLanguages.includes(lang),
      );
      const { translateReviews } = await translate({
        input: { id: review.id, languages: missingLanguages },
      });
      const newTranslations = translateReviews.map((translation) => ({
        id: `generate-${translation.languageCode}`,
        languageCode: translation.languageCode,
        body: translation.body || t("detail.generatedTranslationBody"),
      }));
      setReview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          translations: [...(prev.translations || []), ...newTranslations],
        };
      });
      toast.success(t("generateAllMissingTranslationsSuccess"));
    } catch (error) {
      toast.error(t("generateAllMissingTranslationsError"));
    }
  };

  const handleMissingTranslation = async (
    action: "generate" | "manual",
    language: LanguageCode,
  ) => {
    if (!review || !config) return;
    let body = "";
    if (action === "generate") {
      const { translateReviews } = await translate({
        input: { id: review.id, languages: [language] },
      });
      const translatedReview = translateReviews.find(
        (t) => t.languageCode === language,
      );
      body = translatedReview?.body || t("detail.generatedTranslationBody");
    } else {
      body = t("detail.manualTranslationPlaceholder");
    }
    setReview((prev) => {
      if (!prev) return prev;
      const newTranslation = {
        id: `${action}-${language}`,
        languageCode: language,
        body,
      };
      return {
        ...prev,
        translations: [...(prev.translations || []), newTranslation],
      };
    });
  };

  const handleUpdateReviewTranslation = async () => {
    if (!review || !id) return;
    const mappedTranslations = review.translations.map((translation) => ({
      languageCode: translation.languageCode as LanguageCode,
      body: translation.body,
    }));
    const translations = mappedTranslations.filter(
      (
        translation,
      ): translation is {
        languageCode: LanguageCode;
        body: string;
      } =>
        translation.languageCode !== undefined &&
        translation.body !== undefined,
    );
    await updateTranslationsReview({ input: { id: review.id, translations } });
    await refetch();
  };

  const haveMissingTranslations = useMemo(() => {
    if (!review || !config) return false;
    const languages = config.getReviewsConfig.reviewsLanguages;
    const existingLanguages = review.translations.map((t) => t.languageCode);
    return languages.some((lang) => !existingLanguages.includes(lang));
  }, [review, config]);

  const handleChangeReviewState = async (
    state: ReviewState,
    message?: string,
  ) => {
    if (!review || !id) return;
    try {
      await changeReviewState({
        input: { id: review.id, state, message },
      });
      toast.success(t("detail.changeStateSuccess"));
      await refetch();
    } catch (error) {
      console.error("Error changing review state:", error);
      toast.error(t("detail.changeStateError"));
    }
  };

  const InfoComponent = useMemo(() => {
    if (review?.productVariant) {
      return <ProductInfo review={review} />;
    } else if (review?.order) {
      return <OrderInfo review={review} />;
    }
    return null;
  }, [review]);

  const isDirty = useMemo(() => {
    if (!review || !originalReview) return false;
    return JSON.stringify(review) !== JSON.stringify(originalReview);
  }, [review, originalReview]);

  return (
    <PageBlock className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-2 items-center">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <p className="text-md font-semibold">
                {review?.id ? t("detail.id", { id: review.id }) : null}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {ReviewState.PENDING === review?.state && (
                <ReviewStateChange onSubmit={handleChangeReviewState} />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {review ? (
            <div className="space-y-6">
              <div className="flex gap-4 justify-between items-start">
                <Card className="w-full">
                  <CardContent className="flex items-center gap-4 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {review.authorName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {review.authorEmailAddress}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(review.createdAt, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                      {review.author?.id ? (
                        <div className="text-sm text-gray-600">
                          <Link to={Routes.customers.to(review.author.id)}>
                            {t("detail.viewCustomer")}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                        {t("detail.rating", { rating: review.rating })}
                      </div>
                      <Badge
                        variant={getStateColor(review?.state)}
                        className="mt-4 text-xs font-semibold w-fit"
                      >
                        {t(`state.${review.state.toLowerCase()}`)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <div className="w-full">{InfoComponent}</div>
              </div>
              <div className="space-y-4">
                {review.assets?.length ? (
                  <div className="flex flex-col gap-2">
                    <Label className="text-base font-semibold">
                      {t("detail.assets")}
                    </Label>
                    {review.assets.map((asset) => (
                      <div
                        key={asset.key}
                        className="flex flex-col items-start gap-2"
                      >
                        <ImageWithPreview
                          src={asset.url}
                          alt={asset.key}
                          imageClassName="w-16 h-16 object-cover rounded"
                          previewClassName="w-full h-full object-cover rounded max-w-[400px] max-h-[400px]"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              {review.response && review.responseCreatedAt && (
                <>
                  <Separator />
                  <div className="bg-primary/90 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="text-base font-semibold text-secondary">
                        {t("detail.businessResponse")}
                      </Label>
                      <Badge
                        variant="outline"
                        className="text-xs text-secondary"
                      >
                        {formatDate(review.responseCreatedAt, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Badge>
                    </div>
                    <p className="text-secondary">{review.response}</p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm text-gray-600">
                <div>
                  <span className="font-medium">{t("detail.createdAt")}:</span>{" "}
                  {formatDate(review.createdAt, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <div>
                  <span className="font-medium">{t("detail.updatedAt")}:</span>{" "}
                  {formatDate(review.updatedAt, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("detail.noFound")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {config?.getReviewsConfig.reviewsLanguages &&
              config.getReviewsConfig.reviewsLanguages.length > 1
                ? t("detail.reviewTranslations")
                : t("detail.reviewContent")}
            </CardTitle>
            {config?.getReviewsConfig.reviewsLanguages &&
            config.getReviewsConfig.reviewsLanguages.length > 1 ? (
              <div className="flex items-center gap-4">
                {config?.getReviewsConfig.canTranslate ? (
                  <Button
                    disabled={!haveMissingTranslations}
                    variant="secondary"
                    onClick={handleGenerateAllMissingTranslations}
                  >
                    {t("detail.generateAllMissingTranslations")}
                  </Button>
                ) : null}
                <Button
                  variant="action"
                  disabled={!isDirty}
                  onClick={handleUpdateReviewTranslation}
                >
                  {t("detail.updateReview")}
                </Button>
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {config?.getReviewsConfig.reviewsLanguages.map((lang, index) => {
              const matchingTranslation = review?.translations.find(
                (t) => t.languageCode === lang,
              );
              const isOriginal = !(
                matchingTranslation?.id.startsWith("manual-") ||
                matchingTranslation?.id.startsWith("generate-")
              );

              return (
                <div key={lang}>
                  {index > 0 && <Separator className="mb-6" />}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {lang.toUpperCase()}
                      </Badge>
                    </div>
                    {matchingTranslation ? (
                      <TranslationComponent
                        language={lang}
                        matchingTranslation={matchingTranslation}
                        isOriginal={isOriginal}
                      />
                    ) : (
                      <div className="text-center py-6 rounded-lg">
                        <p className="text-gray-500">
                          {t("detail.noTranslation")}
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-4">
                          {config?.getReviewsConfig.canTranslate ? (
                            <Button
                              variant="action"
                              onClick={() =>
                                handleMissingTranslation("generate", lang)
                              }
                            >
                              {t("detail.generateTranslation")}
                            </Button>
                          ) : null}
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleMissingTranslation("manual", lang)
                            }
                          >
                            {t("detail.manualTranslation")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageBlock>
  );
};

const TranslationComponent = ({
  language,
  matchingTranslation,
  isOriginal,
}: {
  language: string;
  matchingTranslation: ReviewDetail["translations"][number];
  isOriginal: boolean;
}) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const [body, setBody] = useState(matchingTranslation.body);
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`body-${language}`} className="text-sm font-medium">
          {t("detail.reviewBody")}
        </Label>
        <Textarea
          id={`body-${language}`}
          value={body}
          readOnly={isOriginal}
          className="mt-1 min-h-[100px] resize-none"
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
    </div>
  );
};
