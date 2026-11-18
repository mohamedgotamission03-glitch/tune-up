import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";

// Google's public TEST ad unit IDs. Replace via VITE_ADMOB_* env vars for release.
const BANNER_ID =
  import.meta.env.VITE_ADMOB_BANNER_ID ?? "ca-app-pub-3940256099942544/6300978111";
const INTERSTITIAL_ID =
  import.meta.env.VITE_ADMOB_INTERSTITIAL_ID ?? "ca-app-pub-3940256099942544/1033173712";

export const isNative = () => Capacitor.isNativePlatform();

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
      await AdMob.initialize({ initializeForTesting: !import.meta.env.PROD });
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

export const showBanner = async () => {
  if (!(await initAds())) return;
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
  if (!(await initAds())) return;
  lastInterstitial = Date.now();
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID });
    await AdMob.showInterstitial();
  } catch {
    /* ad failed to load – ignore */
  }
};
