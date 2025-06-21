import MainLayout from '@/components/layout/MainLayout';
import LegalPageHeader from '@/components/legal/LegalPageHeader';

const Privacy = () => {
  return (
    <MainLayout>
      <LegalPageHeader title="Privacy Policy" />
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">Privacy Policy Highlights</h3>
            <p className="text-blue-700 mb-2 text-sm">This summary provides key points from our Privacy Policy:</p>
            <ul className="list-disc pl-6 text-blue-700 text-sm">
              <li>We collect personal information when you register, use our platform, or contact us</li>
              <li>We use your data to provide our services, improve our platform, and communicate with you</li>
              <li>We share your information with service providers and partners who help us provide our services</li>
              <li>We implement technical and organizational measures to protect your data</li>
              <li>You have rights to access, correct, and delete your personal information</li>
              <li>We use cookies and similar technologies to enhance your experience</li>
            </ul>
          </div>

          <div className="prose max-w-none prose-headings:text-tw-blue prose-headings:font-bold prose-p:text-gray-700 prose-a:text-tw-blue">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">1. Introduction</h2>
              <p className="mb-4">TradeWizard ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our trading platform and services, including any mobile applications (collectively, the "Services").</p>
              <p>Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">2.1 Personal Data You Provide to Us</h3>
              <p className="mb-4">We collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Register for an account:</strong> Name, email address, password, username</li>
                <li><strong>Complete your profile:</strong> Profile picture, biographical information, preferences</li>
                <li><strong>Subscribe to our services:</strong> Billing information, payment details</li>
                <li><strong>Connect third-party platforms:</strong> API keys, account credentials (encrypted)</li>
                <li><strong>Contact us:</strong> Information provided in your communications with us</li>
                <li><strong>Participate in surveys or promotions:</strong> Responses and contact information</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">2.2 Information Automatically Collected</h3>
              <p className="mb-4">When you use our Services, we automatically collect certain information, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Usage data:</strong> Pages viewed, features used, time spent on platform, trading activity</li>
                <li><strong>Device information:</strong> IP address, browser type, operating system, device information</li>
                <li><strong>Location data:</strong> General location based on IP address</li>
                <li><strong>Cookies and similar technologies:</strong> As described in our Cookie Policy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">3. How We Use Your Information</h2>
              <p className="mb-4">We use your personal information for the following purposes:</p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-6">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Purpose</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Details</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Legal Basis (for EU/EEA/UK)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 text-sm">Providing our Services</td>
                      <td className="py-3 px-4 text-sm">To create and manage your account, process transactions, enable trading features, and maintain our platform</td>
                      <td className="py-3 px-4 text-sm">Performance of a contract</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm">Communication</td>
                      <td className="py-3 px-4 text-sm">To send necessary information about your account, respond to inquiries, and provide customer support</td>
                      <td className="py-3 px-4 text-sm">Performance of a contract, Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm">Platform improvement</td>
                      <td className="py-3 px-4 text-sm">To analyze usage patterns, troubleshoot issues, develop new features, and enhance user experience</td>
                      <td className="py-3 px-4 text-sm">Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm">Security and fraud prevention</td>
                      <td className="py-3 px-4 text-sm">To detect and prevent unauthorized access, fraud, and other illegal activities</td>
                      <td className="py-3 px-4 text-sm">Legal obligation, Legitimate interests</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p>We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, and to comply with our legal obligations.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">4. How We Share Your Information</h2>
              <p className="mb-4">We may share your personal information with the following categories of recipients:</p>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">4.1 Service Providers</h3>
              <p className="mb-4">We share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Cloud hosting and data storage providers</li>
                <li>Payment processors</li>
                <li>Customer support services</li>
                <li>Analytics and performance monitoring services</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">4.2 Third-Party Trading Platforms</h3>
              <p className="mb-4">If you choose to connect your TradeWizard account with third-party trading platforms or exchanges, we will share information necessary to facilitate the connection and functionality of our integrated services.</p>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">4.3 Legal Requirements</h3>
              <p className="mb-4">We may disclose your information when we believe in good faith that such disclosure is necessary to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Comply with applicable laws, regulations, legal processes, or governmental requests</li>
                <li>Protect our rights, privacy, safety, or property</li>
                <li>Detect, prevent, or address fraud, security, or technical issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">5. Your Privacy Rights</h2>
              <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">5.1 For All Users</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information about you.</li>
                <li><strong>Deletion:</strong> You can request that we delete your personal information in certain circumstances.</li>
                <li><strong>Marketing Choices:</strong> You can opt out of marketing communications at any time.</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">5.2 For EEA, UK, and California Residents</h3>
              <p className="mb-4">You may have additional rights, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.</li>
                <li><strong>Restriction of Processing:</strong> You can request that we restrict the processing of your information under certain circumstances.</li>
                <li><strong>Objection:</strong> You can object to the processing of your personal data in certain circumstances.</li>
                <li><strong>Do Not Sell:</strong> California residents can opt out of the "sale" of their personal information as defined by the CCPA.</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">5.3 How to Exercise Your Rights</h3>
              <p className="mb-4">To exercise your privacy rights, you can:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use the privacy controls in your account settings</li>
                <li>Contact us at privacy@tradewizard.com</li>
                <li>Submit a request through our Privacy Request Form</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">6. Data Security</h2>
              <p className="mb-4">We implement appropriate technical and organizational measures to protect the security of your personal information, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Encryption of sensitive information in transit and at rest</li>
                <li>Secure access controls for our systems and databases</li>
                <li>Regular security assessments and testing</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p>However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">7. Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
                <p className="font-medium mt-2">Email: privacy@tradewizard.com</p>
                <p className="font-medium">Address: [Your Company Address]</p>
                <p className="font-medium">Data Protection Officer: dpo@tradewizard.com</p>
                <p className="mt-2 text-sm text-gray-600">If you are located in the European Union, you also have the right to lodge a complaint with your local data protection authority.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;