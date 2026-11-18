import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
  NativeAdFeed,
  NativeAdTemplate,
} from "@capacitor-community/admob";

/**
 * Production ad units. Debug/dev builds automatically use Google's TEST ads
 * (never serve live ads during development - that can get an account suspended).
 * Any unit can be overridden with a VITE_ADMOB_* environment variable.
 */
const PROD = import.meta.env.PROD;
const unit = (envValue: string | undefined, live: string, test: string) => envValue ?? (PROD ? live : test);

const IDS = {
  banner: unit(import.meta.env.VITE_ADMOB_BANNER_ID, "ca-app-pub-2832761207597793/3913003779", "ca-app-pub-3940256099942544/6300978111"),
  interstitial: unit(import.meta.env.VITE_ADMOB_INTERSTITIAL_ID, "ca-app-pub-2832761207597793/2104777287", "ca-app-pub-3940256099942544/1033173712"),
  rewarded: unit(import.meta.env.VITE_ADMOB_REWARDED_ID, "ca-app-pub-2832761207597793/7165532275", "ca-app-pub-3940256099942544/5224354917"),
  appOpen: unit(import.meta.env.VITE_ADMOB_APP_OPEN_ID, "ca-app-pub-2832761207597793/7932139833", "ca-app-pub-3940256099942544/9257395921"),
  native: unit(import.meta.env.VITE_ADMOB_NATIVE_ID, "ca-app-pub-2832761207597793/7469105403", "ca-app-pub-3940256099942544/2247696110"),
};

export const isNative = () => Capacitor.isNativePlatform();

/* ---------- Ad-free reward (24h after watching an optional rewarded ad) ---------- */

const ADFREE_KEY = "tuneup.adfree";
const ADFREE_MS = 24 * 60 * 60 * 1000;

export const isAdFree = () => Number(localStorage.getItem(ADFREE_KEY) ?? 0) > Date.now();

export const useAdFree = () => {
  const [free, setFree] = useState(isAdFree);
  useEffect(() => {
    const sync = () => setFree(isAdFree());
    window.addEventListener("tuneup:adfree", sync);
    return () => window.removeEventListener("tuneup:adfree", sync);
  }, []);
  return free;
};

/* ---------- Initialisation + consent ---------- */

let ready: Promise<boolean> | null = null;

/** Asks for ad consent where required (GDPR/UMP), then starts AdMob. Resolves true if ads may be shown. */
export const initAds = () => {
  if (!isNative()) return Promise.resolve(false);
  ready ??= (async () => {
    try {
      let info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
        info = await AdMob.showConsentForm();
      }
      if (!info.canRequestAds) return false;
      await AdMob.initialize({ initializeForTesting: !PROD });
      return true;
    } catch {
      return false;
    }
  })();
  return ready;
};

/** Lets users review or change their ad privacy choices (required where GDPR applies). */
export const openAdPrivacyOptions = async () => {
  if (!isNative()) return;
  try {
    await AdMob.showPrivacyOptionsForm();
  } catch {
    /* not required for this user */
  }
};

/* ---------- Banner ---------- */

export const showBanner = async () => {
  if (isAdFree() || !(await initAds())) return;
  try {
    await AdMob.showBanner({
      adId: IDS.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 64,
    });
  } catch {
    /* ad failed to load – ignore */
  }
};

export const hideBanner = async () => {
  if (!isNative()) return;
  try {
    await AdMob.removeBanner();
  } catch {
    /* nothing to remove */
  }
};

/* ---------- Full-screen ads: shared pacing so users are never spammed ---------- */

let lastFullscreen = 0;
const INTERSTITIAL_GAP_MS = 2 * 60 * 1000;
let lastInterstitial = 0;

/** Shown only after a completed task, and at most once every 2 minutes. */
export const showInterstitial = async () => {
  if (isAdFree() || !isNative() || Date.now() - lastInterstitial < INTERSTITIAL_GAP_MS) return;
  if (!(await initAds())) return;
  lastInterstitial = lastFullscreen = Date.now();
  try {
    await AdMob.prepareInterstitial({ adId: IDS.interstitial });
    await AdMob.showInterstitial();
  } catch {
    /* ad failed to load – ignore */
  }
  lastFullscreen = Date.now();
};

/** Optional rewarded ad: resolves true if the user earned the reward. */
export const showRewarded = async (): Promise<boolean> => {
  if (!(await initAds())) return false;
  try {
    await AdMob.prepareRewardVideoAd({ adId: IDS.rewarded });
    const reward = await AdMob.showRewardVideoAd();
    lastFullscreen = Date.now();
    return !!reward;
  } catch {
    return false;
  }
};

export const grantAdFree = async () => {
  localStorage.setItem(ADFREE_KEY, String(Date.now() + ADFREE_MS));
  window.dispatchEvent(new Event("tuneup:adfree"));
  await hideBanner();
};

/* ---------- App open ad (when returning to the app) ---------- */

const APP_OPEN_GAP_MS = 30 * 60 * 1000;
const MIN_AWAY_MS = 30 * 1000;
let lastAppOpen = 0;

/** Shows an app-open ad when the user comes back after being away, never during onboarding. */
export const useAppOpenAd = () => {
  useEffect(() => {
    if (!isNative()) return;
    let hiddenAt = 0;
    const onChange = async () => {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }
      const now = Date.now();
      if (
        !hiddenAt ||
        now - hiddenAt < MIN_AWAY_MS ||
        now - lastAppOpen < APP_OPEN_GAP_MS ||
        now - lastFullscreen < 60 * 1000 ||
        isAdFree() ||
        localStorage.getItem("tuneup.onboarded") !== "1"
      )
        return;
      if (!(await initAds())) return;
      lastAppOpen = lastFullscreen = now;
      try {
        await AdMob.loadAppOpen({ adId: IDS.appOpen });
        await AdMob.showAppOpen();
      } catch {
        /* ad failed to load – ignore */
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
};

/* ---------- Native ads ---------- */

let feed: Promise<NativeAdFeed | null> | null = null;

export const getNativeFeed = () => {
  if (!isNative()) return Promise.resolve(null);
  feed ??= initAds().then((ok) =>
    ok
      ? NativeAdFeed.create({
          feedId: "tuneup-feed",
          adId: IDS.native,
          isTesting: !PROD,
          template: NativeAdTemplate.Small,
        }).catch(() => null)
      : null,
  );
  return feed;
};
