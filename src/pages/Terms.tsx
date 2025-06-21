import MainLayout from '@/components/layout/MainLayout';
import LegalPageHeader from '@/components/legal/LegalPageHeader';

const Terms = () => {
  return (
    <MainLayout>
      <LegalPageHeader title="Terms of Service" />
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="prose max-w-none prose-headings:text-tw-blue prose-headings:font-bold prose-p:text-gray-700 prose-a:text-tw-blue">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">1. Introduction</h2>
              <p className="mb-4">Welcome to TradeWizard. By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you must not use our platform.</p>
              <p>TradeWizard provides tools for trading strategy development, backtesting, and implementation. Our services are designed to assist in trading activities but do not guarantee profits or investment success.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">2. Account Registration and Responsibilities</h2>
              <p className="mb-4">To access certain features of TradeWizard, you must create an account. When you create an account, you agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="mb-4">You must be at least 18 years old to create an account. Accounts registered by bots or automated methods are not permitted.</p>
              <p>We reserve the right to suspend or terminate accounts that violate our Terms or if we determine, in our sole discretion, that such action is necessary to protect our platform, users, or third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">3. Bot-Builder Limitations and Restrictions</h2>
              <p className="mb-4">TradeWizard offers tools to create automated trading strategies ("bots"). Users of these tools agree to the following limitations:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Bots created using our platform are for personal or authorized commercial use only</li>
                <li>You are fully responsible for the performance, behavior, and consequences of any bot you create</li>
                <li>You may not develop bots designed to manipulate markets, exploit platform vulnerabilities, or engage in illegal activities</li>
                <li>TradeWizard does not guarantee the profitability or effectiveness of bots created on our platform</li>
                <li>We reserve the right to limit or restrict bot functionality if we determine it is necessary to maintain platform integrity or comply with legal requirements</li>
                <li>Trading bots must be executed in accordance with all applicable laws and regulations governing securities, commodities, and financial instruments</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">4. Third-Party Platform Compatibility</h2>
              <p className="mb-4">TradeWizard offers integration with various third-party trading platforms and exchanges. Regarding these integrations:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>We do not guarantee continuous compatibility with any third-party platform</li>
                <li>Third-party platforms may change their APIs, terms, or functionality at any time, which may affect compatibility</li>
                <li>You are responsible for complying with the terms and conditions of any third-party platform you connect to via TradeWizard</li>
                <li>TradeWizard is not affiliated with, endorsed by, or officially connected with any third-party trading platforms we integrate with, unless explicitly stated</li>
                <li>We are not liable for any losses or damages resulting from the use of third-party platforms or their integration with our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">5. Payment Terms and Subscription</h2>
              <p className="mb-4">TradeWizard offers various subscription plans with different features and pricing. By subscribing to our paid services:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>You agree to pay all fees in accordance with the pricing and terms presented at the time of purchase</li>
                <li>Subscription fees are charged in advance on a monthly or annual basis, depending on your selected plan</li>
                <li>Subscriptions automatically renew unless canceled at least 24 hours before the renewal date</li>
                <li>You can cancel your subscription at any time through your account settings</li>
                <li>We do not offer refunds for partial subscription periods unless required by law</li>
                <li>We reserve the right to change our pricing with reasonable notice before the next billing cycle</li>
                <li>Failure to pay fees may result in suspension or termination of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">6. User Restrictions and Prohibited Activities</h2>
              <p className="mb-4">When using TradeWizard, you agree not to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Use our platform for any illegal purposes or to promote illegal activities</li>
                <li>Attempt to gain unauthorized access to any part of our platform or other users' accounts</li>
                <li>Interfere with or disrupt the integrity or performance of our platform</li>
                <li>Create or use bots designed to manipulate markets or engage in fraudulent activities</li>
                <li>Share your account credentials with others or allow multiple users to access a single account</li>
                <li>Scrape, data-mine, or extract data from our platform without explicit written permission</li>
                <li>Use our platform to distribute malware, spyware, or other harmful code</li>
                <li>Engage in any activity that places an unreasonable load on our infrastructure</li>
                <li>Misrepresent your identity or affiliation with any person or organization</li>
              </ul>
              <p>Violation of these restrictions may result in immediate termination of your account and potential legal action.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">7. Disclaimers and Limitations of Liability</h2>
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">7.1 No Investment Advice</h3>
              <p className="mb-4">TradeWizard provides tools for trading strategy development and implementation but does not provide investment advice. The information, bots, and strategies available on our platform are for informational purposes only and should not be considered financial advice. You should consult with a financial professional before making investment decisions.</p>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">7.2 Trading Risks</h3>
              <p className="mb-4">Trading in financial markets involves substantial risk of loss and is not suitable for all investors. You are solely responsible for your trading decisions and the risks associated with them. Past performance of any trading system or methodology is not necessarily indicative of future results.</p>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">7.3 "As Is" Basis</h3>
              <p className="mb-4">Our platform is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. We do not guarantee that our platform will be uninterrupted, error-free, or completely secure.</p>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">7.4 Limitation of Liability</h3>
              <p>To the fullest extent permitted by law, TradeWizard and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, resulting from your use of our platform, any content on our platform, or any bots or strategies developed using our platform, even if we have been advised of the possibility of such damages.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">8. Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p className="font-medium mt-2">Email: legal@tradewizard.com</p>
                <p className="font-medium">Address: [Your Company Address]</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;