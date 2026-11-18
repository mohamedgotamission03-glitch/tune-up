import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tuneup.optimizer",
  appName: "TuneUp",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
};

export default config;
