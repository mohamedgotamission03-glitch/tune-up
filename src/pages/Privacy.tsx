import { LegalPage } from "@/components/LegalPage";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/appInfo";

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    sections={[
      {
        title: "Overview",
        body: <p>{APP_NAME} ("we", "the app") helps you monitor and optimise your Android device. This policy explains what information the app handles and how it is used.</p>,
      },
      {
        title: "Information we collect",
        body: (
          <>
            <p>We do not require an account and we do not collect your name, email, contacts, messages, photos or location.</p>
            <p>Device information shown in the app (for example storage, memory, battery and network type) is read locally on your device and is not sent to our servers.</p>
            <p>Your tool history and health score are stored locally on your device only.</p>
          </>
        ),
      },
      {
        title: "Advertising (Google AdMob)",
        body: (
          <>
            <p>The app shows ads served by Google AdMob. AdMob may collect and use your device's advertising ID, IP address, app interaction data and general device information to serve and measure ads and to prevent fraud.</p>
            <p>You can reset your advertising ID or opt out of personalised ads in Android Settings → Google → Ads. Learn more at policies.google.com/technologies/ads.</p>
          </>
        ),
      },
      {
        title: "Speed test",
        body: <p>The speed test downloads a small file from a third-party network (Cloudflare) to measure your connection. Your IP address is visible to that service as part of a normal internet request.</p>,
      },
      {
        title: "Data sharing and security",
        body: <p>We do not sell your personal data. Data is shared only with the advertising partner described above. Locally stored data stays on your device and is removed when you uninstall the app.</p>,
      },
      {
        title: "Children",
        body: <p>The app is not directed to children under 13 and we do not knowingly collect their personal information.</p>,
      },
      {
        title: "Changes",
        body: <p>We may update this policy from time to time. The latest version is always available inside the app.</p>,
      },
      {
        title: "Contact",
        body: <p>Questions? Email us at {SUPPORT_EMAIL}.</p>,
      },
    ]}
  />
);

export default Privacy;
