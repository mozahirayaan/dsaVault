import React from "react";

const PrivacyPolicy = () => {
  return (
    <main className="bg-gradient-to-br from-white to-gray-100 py-16 px-4 sm:px-8">
      <section className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 sm:p-12 text-gray-800">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Effective Date: June 4, 2025</p>
        </header>

        <p className="mb-6">
          At <strong>DSA Vault</strong>, your privacy is a top priority. This Privacy Policy
          describes how we collect, use, and protect your personal information when you use
          our Chrome Extension. By installing and using the extension, you agree to the terms
          of this policy.
        </p>

        {/* Section: Information Collected */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Google Account Information:</strong> We collect your name, email address, and profile picture via Google OAuth 2.0 only after you explicitly log in.</li>
            <li><strong>DSA Problem Data:</strong> Any problem title, platform, or solution link you manually save is stored for your own use.</li>
            <li><strong>Browser Storage Data:</strong> We may use `chrome.storage` to store user preferences or cached data locally.</li>
          </ul>
        </section>

        {/* Section: Usage of Data */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To display saved DSA problems on your personal dashboard.</li>
            <li>To customize and personalize your experience within the extension.</li>
            <li>To support features like room-based collaboration and activity tracking.</li>
          </ul>
        </section>

        {/* Section: Data Storage & Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Data Storage & Security</h2>
          <p className="mb-4">
            We store your data securely in encrypted databases using modern cloud infrastructure.
            All communication between the extension and our backend is encrypted using HTTPS.
            Your data is not accessible to anyone except you.
          </p>
        </section>

        {/* Section: Third-Party Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
          <p>
            We use Google OAuth 2.0 for authentication. We do not share your personal data with
            any third-party service providers. No analytics or ads are run from within the extension.
          </p>
        </section>

        {/* Section: Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Cookies & Local Data</h2>
          <p>
            We do not use cookies. Any local storage used is solely to remember your preferences
            and improve user experience without transferring data outside your browser.
          </p>
        </section>

        {/* Section: User Control */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Access:</strong> You can request a copy of your stored data anytime.</li>
            <li><strong>Deletion:</strong> Email us to request permanent deletion of your account data.</li>
            <li><strong>Consent Withdrawal:</strong> You can disconnect your Google account from the extension at any time.</li>
          </ul>
        </section>

        {/* Section: Changes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Changes to This Policy</h2>
          <p>
            We may update this policy in the future to comply with legal changes or improve
            transparency. The latest version will always be available at the URL you are viewing.
          </p>
        </section>

        {/* Section: Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or your data, please contact us at:
            <br />
            <a href="mailto:websitekaguru@gmail.com" className="text-indigo-600 underline">dsavault.support@gmail.com</a>
          </p>
        </section>

        {/* Compliance */}
        <p className="mt-10 text-center text-sm text-gray-500">
          This extension complies with Google's <a href="https://developer.chrome.com/docs/webstore/user_data/" className="underline">User Data Policy</a> and <a href="https://developer.chrome.com/docs/webstore/program_policies/" className="underline">Chrome Web Store Program Policies</a>.
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
