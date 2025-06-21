import MainLayout from '@/components/layout/MainLayout';
import LegalPageHeader from '@/components/legal/LegalPageHeader';

const Cookies = () => {
  return (
    <MainLayout>
      <LegalPageHeader title="Cookie Policy" />
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-amber-800">Cookie Consent</h3>
                <p className="text-amber-700 mt-1 text-sm">By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. You can manage your cookie preferences at any time through your browser settings.</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none prose-headings:text-tw-blue prose-headings:font-bold prose-p:text-gray-700 prose-a:text-tw-blue">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">1. Introduction</h2>
              <p className="mb-4">This Cookie Policy explains how TradeWizard ("we," "our," or "us") uses cookies and similar technologies on our website and platform to enhance your browsing experience, analyze site traffic, personalize content, and assist in our marketing efforts.</p>
              <p>By using our website, you consent to the use of cookies in accordance with this Cookie Policy. If you do not accept the use of cookies, please disable them as described in this policy or refrain from using our website.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">2. What Are Cookies?</h2>
              <p className="mb-4">Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better browsing experience, and give website owners information about how users interact with their site.</p>
              <p className="mb-4">Cookies can be:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Session cookies:</strong> These are temporary and are deleted when you close your browser.</li>
                <li><strong>Persistent cookies:</strong> These remain on your device until they expire or you delete them.</li>
                <li><strong>First-party cookies:</strong> These are set by the website you are visiting.</li>
                <li><strong>Third-party cookies:</strong> These are set by a domain other than the one you are visiting.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">3. Types of Cookies We Use</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-6">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Category</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Purpose</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 text-sm"><strong>Essential/Necessary</strong></td>
                      <td className="py-3 px-4 text-sm">These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and remember your preferences.</td>
                      <td className="py-3 px-4 text-sm">Authentication cookies, security cookies, load balancing cookies</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm"><strong>Functionality</strong></td>
                      <td className="py-3 px-4 text-sm">These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.</td>
                      <td className="py-3 px-4 text-sm">Language preference cookies, theme preference cookies</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm"><strong>Analytics/Performance</strong></td>
                      <td className="py-3 px-4 text-sm">These cookies collect information about how visitors use our website, which pages they visit, and if they encounter errors. The data helps us improve our website and your experience.</td>
                      <td className="py-3 px-4 text-sm">Google Analytics, Hotjar</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm"><strong>Marketing/Advertising</strong></td>
                      <td className="py-3 px-4 text-sm">These cookies track your online activity to help advertisers deliver more relevant advertising or limit the number of times you see an ad. They can also help measure the effectiveness of advertising campaigns.</td>
                      <td className="py-3 px-4 text-sm">Google Ads, Facebook Pixel</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">4. Third-Party Cookies</h2>
              <p className="mb-4">We use third-party services on our website that may set cookies on your device. These services include:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Analytics:</strong> We use Google Analytics to understand how visitors interact with our website. You can learn more about Google Analytics cookies <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" className="text-tw-blue hover:underline">here</a>.</li>
                <li><strong>Social Media:</strong> If you use social sharing buttons on our website, these platforms may set cookies on your device.</li>
                <li><strong>Third-Party Integrations:</strong> Our platform integrates with various trading platforms and services, which may set their own cookies.</li>
              </ul>
              <p>These third parties have their own privacy policies and cookie practices that we do not control. We recommend reviewing their respective privacy and cookie policies for more information.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">5. Managing Cookies</h2>
              <p className="mb-4">You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie preferences. You can:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Delete cookies from your device</li>
                <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
                <li>Set your browser to notify you when you receive a cookie</li>
              </ul>
              
              <p className="mb-4">Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.</p>
              
              <p className="mb-4">Instructions for managing cookies in common browsers:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-tw-blue hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-tw-blue hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" className="text-tw-blue hover:underline">Microsoft Edge</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-tw-blue hover:underline">Safari</a></li>
              </ul>
              
              <p>Additionally, you can learn more about cookies and how to manage them on <a href="https://www.aboutcookies.org/" className="text-tw-blue hover:underline">AboutCookies.org</a> or <a href="https://www.allaboutcookies.org/" className="text-tw-blue hover:underline">AllAboutCookies.org</a>.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">6. Updates to This Cookie Policy</h2>
              <p className="mb-4">We may update this Cookie Policy from time to time to reflect changes in technology, law, our business operations, or any other reason we deem necessary or appropriate. When we make changes, we will update the "Last Updated" date at the top of this policy and, in some cases, we may provide additional notice.</p>
              <p>We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies and related technologies.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">7. Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us at:</p>
                <p className="font-medium mt-2">Email: privacy@tradewizard.com</p>
                <p className="font-medium">Address: [Your Company Address]</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cookies;