import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { CircleUser, ArrowRight } from "lucide-react"
import { cn, Routes, ScrollArea } from "@deenruv/react-ui-devkit"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  useLazyQuery,
  useMutation,
  Badge,
} from "@deenruv/react-ui-devkit"
import { translationNS } from "../translation-ns"
import { useForm, FormProvider } from "react-hook-form"
import { startOrderExportToReplicateMutation } from "../graphql/mutations.js"
import {
  getPredictionIDQuery,
  getReplicatePredictionsQuery,
  getPredictionItemQuery,
} from "../graphql/queries.js"
import { PredictionStatus, PredictionType, SortOrder } from "../zeus/index.js"
import type { ReplicateEntityListType, ReplicatePredictionListType } from "../graphql/selectors.js"
import { DatePickerWithRange, copyToClipboard, exportToCsv } from "./ReplicateUtilities.js"
import { useLocation, useNavigate } from "react-router-dom"
import React from "react"

type Formvalues = {
  num_prospects: number
  start_date: string
  end_date: string
  predict_type: PredictionType
  show_metrics: boolean
}

const PredictionStatusTypes = [
  {
    value: PredictionStatus.starting,
    label: "In progress",
  },
  {
    value: PredictionStatus.succeeded,
    label: "Completed",
  },
  {
    value: PredictionStatus.failed,
    label: "Failed",
  },
]

const MAX_RETRIES = 25

export const ReplicateInput = () => {
  const { t } = useTranslation(translationNS)
  const location = useLocation()
  const navigate = useNavigate()
  const methods = useForm<Formvalues>({
    defaultValues: {
      num_prospects: 100,
      start_date: "",
      end_date: "",
      predict_type: PredictionType.RFM_SCORE,
      show_metrics: true,
    },
  })

  const getQueryParams = (query: string) => {
    if (!query || query === "") return {}
    const [key, value] = query.substring(1).split("=")
    return key && value ? { [key]: value } : {}
}

const queryParams = getQueryParams(location.search)
const replicateId = queryParams.replicateId

  const [items, setItems] = useState<ReplicateEntityListType["items"]>([])
  const [totalItems, setTotalItems] = useState<ReplicateEntityListType["totalItems"]>(0)
  const [predictions, setPredictions] = useState<ReplicatePredictionListType["predictions"]>([])
  const { register, handleSubmit } = methods
  const [startOrderExportToReplicate] = useMutation(startOrderExportToReplicateMutation)
  const [getPredictionID] = useLazyQuery(getPredictionIDQuery)
  const [getReplicatePredictions] = useLazyQuery(getReplicatePredictionsQuery)
  const [getPredictionItem] = useLazyQuery(getPredictionItemQuery)
  const [predictionID, setPredictionID] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [predictionEntityID, setPredictionEntityID] = useState<string | null>(null)
  const [activePredictionId, setActivePredictionId] = useState<string | null>(replicateId || null)
  const [shouldStartPolling, setShouldStartPolling] = useState(false)
  const [isPolling, setIsPolling] = useState(true)
  const retryCountRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryPredictionCountRef = useRef(0)

  useEffect(() => {
    if (activePredictionId) {
      const newUrl = `${location.pathname}?replicateId=${activePredictionId}`
      navigate(newUrl, { replace: true })
    }
  }, [activePredictionId, navigate, location.pathname])
  
  useEffect(() => {
    if (replicateId) {
      setActivePredictionId(replicateId)
      fetchPrediction(replicateId)
    }
  }, [predictions])

  useEffect(() => {
    if (!predictionEntityID || !isPolling) return

    intervalRef.current = setInterval(() => {
      if (retryCountRef.current >= MAX_RETRIES) {
        console.warn("Max retries reached. Stopping polling.")
        clearInterval(intervalRef.current as NodeJS.Timeout)
        setIsPolling(false)
        return
      }

      getPredictionID({
        prediction_entity_id: predictionEntityID,
      })
        .then((response) => {
          if (response?.getPredictionID) {
            clearInterval(intervalRef.current as NodeJS.Timeout)
            setIsPolling(false)
            setPredictionID(response.getPredictionID)

            setActivePredictionId(response.getPredictionID)
          } else {
            retryCountRef.current += 1
          }
        })
        .catch((error) => {
          console.error("Error fetching prediction:", error)
          retryCountRef.current += 1
        })
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [predictionEntityID, isPolling])

  function fetchList() {
    getReplicatePredictions({
      options: { sort: { finishedAt: SortOrder.DESC } },
    }).then((response) => {
      if (response?.getReplicatePredictions) {
        const predictions = response.getReplicatePredictions.items
        setItems(predictions)
        setTotalItems(response.getReplicatePredictions.totalItems)

        const startingPredictions = predictions.filter((item) => item.status === PredictionStatus.starting)
        startingPredictions.forEach((prediction) => {
          getPredictionItem({
            id: prediction.id,
          }).then((response) => {
            if (response?.getPredictionItem) {
              fetchList()
            }
          })
        })
      }
    })
  }

  useEffect(() => {
    fetchList()
  }, [])

  useEffect(() => {
    if (!shouldStartPolling) return

    const pollInterval = 2000
    const maxRetries = 40
    let retryCount = 0

    const intervalId = setInterval(() => {
      if (retryCount >= maxRetries) {
        clearInterval(intervalId)
        setShouldStartPolling(false)
        return
      }
      getReplicatePredictions({
        options: { sort: { finishedAt: SortOrder.DESC } },
      }).then((response) => {
        if (response?.getReplicatePredictions) {
          const predictions = response.getReplicatePredictions.items
          setItems(predictions)
          setTotalItems(response.getReplicatePredictions.totalItems)

          const startingPrediction = predictions.find((item) => item.status === PredictionStatus.starting)
          if (startingPrediction) {
            setActivePredictionId(startingPrediction.id)
          }

          if (!predictions.some((item) => item.status === PredictionStatus.starting)) {
            clearInterval(intervalId)
            setShouldStartPolling(false)
          }
        }
      })

      retryCount++
    }, pollInterval)

    return () => clearInterval(intervalId)
  }, [shouldStartPolling])

  function fetchPrediction(predictionID: string) {
    if (!predictionID) return

    setActivePredictionId(predictionID)

    getPredictionItem({
      id: predictionID,
    })
      .then((response) => {
        if (response?.getPredictionItem) {
          if (response.getPredictionItem.status === PredictionStatus.succeeded) {
            setPredictions(response.getPredictionItem.predictions)
            setLoading(false)
          } else if (response.getPredictionItem.status === PredictionStatus.failed) {
            setPredictions([])
            setLoading(false)
          } else if (response.getPredictionItem.status === PredictionStatus.starting) {
            setPredictionID(predictionID)
            retryPredictionCountRef.current = 0
          }
        } else {
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error)
        setLoading(false)
      })
  }

  const submit = async (data: Formvalues) => {
    try {
      setPredictionID(null)
      setPredictionEntityID(null)
      setIsPolling(true)
      retryCountRef.current = 0
      retryPredictionCountRef.current = 0
      setLoading(true)
      setShouldStartPolling(true)

      const response = await startOrderExportToReplicate({
        input: {
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          predictType: data.predict_type,
          showMetrics: data.show_metrics,
        },
      })

      setPredictionEntityID(response.startOrderExportToReplicate)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case PredictionStatus.succeeded:
        return "bg-green-500"
      case PredictionStatus.failed:
        return "bg-red-500"
      case PredictionStatus.starting:
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full h-screen px-4 py-2 md:px-8 md:py-4 flex gap-4">
        <div className="w-1/3 flex flex-col gap-4">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col gap-2">
                  <CardTitle>{t("Set up your model")}</CardTitle>
                </div>
                <Button onClick={handleSubmit((data) => submit(data))}>{t("Run model")}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-4 items-start">
                <div className="flex flex-col gap-1">
                  <Label>{t("Show X the best prospects:")}</Label>
                  <Input className="w-[175px]" {...register("num_prospects")} />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>{t("Orders data range:")}</Label>
                  <DatePickerWithRange />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full h-[calc(100vh-288px)]">
            <CardHeader>
              <CardTitle>{t("Previous model runs")}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-64px)]">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-3">
                  {items.map((item, index) => (
                    <Card
                      key={index}
                      className={cn(
                        "border hover:border-primary transition-colors",
                        activePredictionId === item.id ? "border-black border-2" : "",
                      )}
                      onClick={() => fetchPrediction(item.id)}
                    >
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-medium truncate max-w-[200px]">#{item.id}</span>
                              <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
                                {PredictionStatusTypes.find((status) => status.value === item.status)?.label}
                              </Badge>
                              <span className="text-sm font-medium truncate max-w-[200px]">
                                {item.finishedAt ? new Date(item.finishedAt as string).toLocaleString() : " "}
                              </span>
                            </div>
                          </div>
                          {item.status === PredictionStatus.succeeded && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => fetchPrediction(item.id)}
                              title={t("Fetch predictions")}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Card className="w-2/3 h-[calc(100vh-100px)]">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-2">
                <CardTitle>{t("The most promising customers")}</CardTitle>
                <CardDescription>
                  {loading}
                </CardDescription>
              </div>
              {predictions?.length != 0 && (
                <div className="flex gap-1">
                  <Button
                    onClick={() =>
                      predictions &&
                      copyToClipboard(
                        "[" + predictions.map((predictions) => predictions.customer?.emailAddress).join(", ") + "]",
                      )
                    }
                  >
                    {t("Copy to clipboard")}
                  </Button>
                  <Button onClick={() => exportToCsv(predictions)}>{t("Export to CSV")}</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-100px)]">
            {loading ? (
                <div>{t("loading")}</div>
            ) : (
              <div className="flex flex-col gap-2 h-full">
                {predictions && (
                  <ScrollArea className="h-full">
                    <div className="flex flex-col gap-3">
                      {(predictions ?? []).slice(0, methods.watch("num_prospects")).map((prediction) => (
                        <Card key={prediction.customer?.id || Math.random().toString()}>
                          <CardContent className="py-3">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center">
                                <CircleUser className="mr-2" />
                                {prediction.customer?.firstName} {prediction.customer?.lastName}
                                <span className="ml-2 text-muted-foreground">
                                  ({prediction.customer?.emailAddress})
                                </span>
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => window.open(Routes.customers.to(prediction.customer?.id || ""))}
                                title={t("Go to customer profile")}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
}
