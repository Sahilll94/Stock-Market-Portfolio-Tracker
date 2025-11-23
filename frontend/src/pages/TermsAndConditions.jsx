import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-white/50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-4 transition-colors duration-300 ${
              isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className={`text-4xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Terms and Conditions
          </h1>
          <p className={`mt-2 text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Last updated: November 24, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`prose prose-sm max-w-none transition-colors duration-300 ${
          isDark
            ? 'prose-invert'
            : 'prose'
        }`}>

          {/* Section 1 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              1. Acceptance of Terms
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              By accessing and using PortfolioTrack ("the Service"), you agree to be bound by these Terms and Conditions. 
              If you do not agree to any part of these terms, you may not use the Service. We reserve the right to modify 
              these terms at any time, and your continued use of the Service following any changes constitutes your acceptance 
              of the new terms.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              2. Use License
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Permission is granted to temporarily download one copy of the materials (information or software) on PortfolioTrack 
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul className={`list-disc list-inside space-y-2 mt-4 text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Using any automated tools to access the Service without authorization</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              3. User Accounts
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              When you create an account on PortfolioTrack, you are responsible for maintaining the confidentiality of your 
              password and account information. You agree to accept responsibility for all activities that occur under your 
              account. You agree to provide accurate, current, and complete information during registration and to update such 
              information to keep it accurate, current, and complete.
            </p>
            <p className={`text-base leading-relaxed mt-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              You are solely responsible for any content you post or actions you take through your account. You agree not to:
            </p>
            <ul className={`list-disc list-inside space-y-2 mt-4 text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service for any unlawful purpose</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              4. Portfolio Tracking and Data
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              PortfolioTrack provides tools to track your investment portfolio and analyze market data. All information provided 
              is for informational purposes only and should not be considered as financial, investment, or trading advice. We do 
              not guarantee the accuracy, completeness, or timeliness of any information provided through the Service.
            </p>
            <p className={`text-base leading-relaxed mt-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              You are entirely responsible for all investment decisions you make based on information from the Service. Before 
              making any investment decisions, please consult with a qualified financial advisor.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              5. Third-Party Services and APIs
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              PortfolioTrack uses third-party APIs and services to provide real-time stock data and market information. We are 
              not responsible for:
            </p>
            <ul className={`list-disc list-inside space-y-2 mt-4 text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Accuracy or availability of third-party data</li>
              <li>Disruptions in third-party services</li>
              <li>Any content or policies of third-party services</li>
              <li>Changes or discontinuation of third-party APIs</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              6. Disclaimer of Warranties
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              The Service and all materials, information, software, and functionality contained therein are provided on an "as-is" 
              and "as-available" basis. PortfolioTrack disclaims all warranties, express or implied, including but not limited to 
              implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p className={`text-base leading-relaxed mt-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              We do not warrant that:
            </p>
            <ul className={`list-disc list-inside space-y-2 mt-4 text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>The Service will meet your requirements</li>
              <li>The Service will be uninterrupted, timely, secure, or error-free</li>
              <li>Any errors in the Service will be corrected</li>
              <li>Results obtained from the Service will be accurate or reliable</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              7. Limitation of Liability
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              To the maximum extent permitted by law, in no event shall PortfolioTrack, its owners, operators, or contributors 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to 
              loss of profits, loss of data, or loss of use, even if advised of the possibility of such damages.
            </p>
            <p className={`text-base leading-relaxed mt-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Your sole and exclusive remedy for dissatisfaction with the Service is to cease using the Service.
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              8. Indemnification
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              You agree to indemnify and hold harmless PortfolioTrack, its owners, operators, and contributors from any and all 
              claims, damages, liabilities, and expenses (including reasonable attorney's fees) arising out of or in connection 
              with your use of the Service or violation of these Terms and Conditions.
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              9. Data and Privacy
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Your use of the Service is also governed by our Privacy Policy. Please review the Privacy Policy to understand our 
              practices regarding the collection and use of your information. By using the Service, you consent to the collection 
              and use of your information as described in the Privacy Policy.
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              10. Prohibited Conduct
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              You agree not to engage in any conduct that:
            </p>
            <ul className={`list-disc list-inside space-y-2 mt-4 text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Is unlawful, illegal, or violates any law or regulation</li>
              <li>Harms, threatens, harasses, defames, or embarrasses any other person</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains viruses, malware, or harmful code</li>
              <li>Constitutes spam, phishing, or social engineering</li>
              <li>Attempts to gain unauthorized access to the Service</li>
              <li>Interferes with the operation or functionality of the Service</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              11. Termination
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              PortfolioTrack reserves the right to terminate or suspend your account and access to the Service at any time, 
              without cause or notice. We may also remove any content from the Service at our sole discretion. Upon termination, 
              your right to use the Service will immediately cease.
            </p>
          </div>

          {/* Section 12 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              12. Governing Law
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which 
              PortfolioTrack operates, without regard to its conflict of law provisions. Any legal suit, action, or proceeding 
              arising out of or related to these terms and your use of the Service shall be instituted exclusively in the courts 
              of the applicable jurisdiction.
            </p>
          </div>

          {/* Section 13 */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              13. Contact Information
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>PortfolioTrack Support</strong><br />
                Email: contact@sahilfolio.live<br />
                Website: https://portfoliotrack.sahilfolio.live/
              </p>
            </div>
          </div>

          {/* Section 14 */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              14. Entire Agreement
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              These Terms and Conditions, along with our Privacy Policy and any other policies or agreements posted on the Service, 
              constitute the entire agreement between you and PortfolioTrack regarding your use of the Service and supersede all 
              prior negotiations, representations, and agreements, whether written or oral.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/register')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              Return to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
