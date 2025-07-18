'use client';

interface OfficialCompletionPageProps {
  validationCode: string;
  onStartOver: () => void;
}

export function OfficialCompletionPage({
  validationCode,
  onStartOver,
}: OfficialCompletionPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - matches exactly */}
          <div className="lg:col-span-2">
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
              <h2 className="text-sm font-semibold text-yellow-800 mb-1">
                🎓 Demo Completed Successfully!
              </h2>
              <p className="text-xs text-yellow-700">
                This is a simulated validation code. Real McDonald&apos;s
                automation would be blocked by their security systems.
              </p>
            </div>

            <h1 className="text-2xl font-bold text-black mb-6">
              Thank you for completing this survey.
            </h1>

            <p className="text-base text-gray-700 mb-6">
              Please write the following validation code on your receipt.
            </p>

            <div className="mb-8">
              <p className="text-lg font-bold text-black">
                Validation Code:{' '}
                <span className="text-2xl">{validationCode}</span>
              </p>
            </div>

            <div className="text-sm text-gray-700 leading-relaxed mb-6">
              <p>
                Expires 30 days after date issued. Valid for product of equal or
                lesser value. Valid only at participating U.S. McDonald&apos;s.
                Not valid with any other offer, discount, coupon or any combo
                meal. Cash value 1/20 of 1 cent. Limit one coupon per person per
                visit. Tax may apply. Single item at regular price. Coupon may
                not be transferred, auctioned, sold or duplicated in any way or
                transmitted via electronic media. Valid when product served. May
                not be valid for custom orders. Not valid for McDelivery or
                Mobile Order & Pay. Void where prohibited. ©2025
                McDonald&apos;s
              </p>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              You may now redeem the offer on your receipt during your next
              visit to participating locations.
            </p>

            <p className="text-sm text-gray-700 mb-8">
              Thanks for taking the time to share your feedback with us. This
              valuable information will be shared with the Owner/Operator to
              help us continue improving our business.
            </p>

            <div className="flex gap-4">
              <button
                onClick={onStartOver}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium"
              >
                Try Another Demo
              </button>
              <a
                href="https://mcdvoice.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded text-sm font-medium"
              >
                Visit Real Survey Site
              </a>
            </div>
          </div>

          {/* Sidebar - simplified */}
          <div className="space-y-6">
            <div className="border border-gray-200 p-4">
              <h3 className="font-bold text-lg text-black mb-4">
                Stay Connected
              </h3>
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xs">M</span>
                </div>
                <span className="text-sm">Visit our Website</span>
              </div>
            </div>

            <div className="border border-gray-200 p-4">
              <h3 className="font-bold text-lg text-black mb-4">
                Want to hear more from McDonald&apos;s?
              </h3>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 text-sm">
                Join Our Email List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
