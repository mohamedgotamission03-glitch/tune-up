import { LegalPage } from "@/components/LegalPage";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/appInfo";

const Terms = () => (
  <LegalPage
    title="Terms of Service"
    sections={[
      {
        title: "Acceptance",
        body: <p>By installing or using {APP_NAME} you agree to these Terms. If you do not agree, please uninstall the app.</p>,
      },
      {
        title: "Use of the app",
        body: <p>{APP_NAME} is provided for personal, non-commercial use to help you monitor and tidy your device. You agree not to misuse, reverse engineer or interfere with the app.</p>,
      },
      {
        title: "No guarantees",
        body: <p>Optimisation results, scores and estimates are indicative and may vary by device and Android version. The app is provided "as is" without warranties of any kind.</p>,
      },
      {
        title: "Advertising",
        body: <p>The app is free and supported by advertising provided by Google AdMob. Third-party ads are the responsibility of their advertisers.</p>,
      },
      {
        title: "Limitation of liability",
        body: <p>To the fullest extent permitted by law, we are not liable for any loss of data or damages arising from your use of the app. Please back up important data.</p>,
      },
      {
        title: "Changes",
        body: <p>We may update these Terms. Continued use after changes means you accept the updated Terms.</p>,
      },
      {
        title: "Contact",
        body: <p>Questions? Email us at {SUPPORT_EMAIL}.</p>,
      },
    ]}
  />
);

export default Terms;
