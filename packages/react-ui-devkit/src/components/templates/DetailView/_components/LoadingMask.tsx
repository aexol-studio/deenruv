import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation.js";

export const LoadingMask: React.FC = () => {
  const { t } = useTranslation("common");
  return (
    <motion.div
      className="bg-background/90 absolute inset-0 z-50 flex h-screen w-full items-center justify-center backdrop-blur-sm"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Loader2 className="text-primary size-12" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-foreground text-lg font-medium"
        >
          {t("loading")}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
