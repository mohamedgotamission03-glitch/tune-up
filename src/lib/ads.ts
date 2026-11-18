import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";

// Google's public TEST ad unit IDs. Replace via VITE_ADMOB_* env vars for release.
const BANNER_ID =
  import.meta.env.VITE_ADMOB_BANNER_ID ?? "ca-app-pub-3940256099942544/6300978111";
const INTERSTITIAL_ID =
  import.meta.env.VITE_ADMOB_INTERSTITIAL_ID ?? "ca-app-pub-3940256099942544/1033173712";

export const isNative = () => Capacitor.isNativePlatform();

let ready: Promise<void> | null = null;

export const initAds = () => {
  if (!isNative()) return Promise.resolve();
  ready ??= AdMob.initialize({ initializeForTesting: !import.meta.env.PROD }).then(
    () => undefined,
    () => undefined,
  );
  return ready;
};

export const showBanner = async () => {
  if (!isNative()) return;
  await initAds();
  try {
    await AdMob.showBanner({
      adId: BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 64,
    });
  } catch {
    /* ad failed to load – ignore */
  }
};

const INTERSTITIAL_GAP_MS = 3 * 60 * 1000;
let lastInterstitial = 0;

/** Shown only after a completed task, and at most once every 3 minutes. */
export const showInterstitial = async () => {
  if (!isNative() || Date.now() - lastInterstitial < INTERSTITIAL_GAP_MS) return;
  lastInterstitial = Date.now();
  await initAds();
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID });
    await AdMob.showInterstitial();
  } catch {
    /* ad failed to load – ignore */
  }
};
