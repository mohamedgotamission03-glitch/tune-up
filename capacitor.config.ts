import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mogu.tuneup",
  appName: "TuneUp",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
};

export default config;
