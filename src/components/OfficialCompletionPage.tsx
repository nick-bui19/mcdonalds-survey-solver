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
    <div className="min-h-screen bg-gray-50">
      {/* Red Header Bar */}
      <div className="h-2 bg-red-600"></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-black mb-4">
              Thank you for completing this survey.
            </h1>

            <p className="text-gray-700 mb-6">
              Please write the following validation code on your receipt.
            </p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-black mb-2">
                Validation Code:{' '}
                <span className="text-2xl font-bold">{validationCode}</span>
              </h2>
            </div>

            <div className="text-sm text-gray-700 space-y-2 mb-6">
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

            <p className="text-sm text-gray-700 mb-4">
              You may now redeem the offer on your receipt during your next
              visit to participating locations.
            </p>

            <p className="text-sm text-gray-700 mb-8">
              Thanks for taking the time to share your feedback with us. This
              valuable information will be shared with the Owner/Operator to
              help us continue improving our business.
            </p>

            <button
              onClick={onStartOver}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium"
            >
              Complete Another Survey
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-black mb-4">
                Stay Connected
              </h3>

              <div className="mb-4">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                  <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">M</span>
                  </div>
                  <span className="text-sm">Visit our Website</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-black mb-4">
                Want to hear more from McDonald&apos;s?
              </h3>

              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm">
                Join Our Email List
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <p>
              All content herein © 2025 Service Management Group, Inc., except
              that McDonald&apos;s owns all survey data collected herein. All
              rights reserved. McDonald&apos;s customers may participate in up
              to five surveys per month per restaurant.
            </p>
            <div className="flex items-center space-x-2">
              <span>Powered by</span>
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs">SMG</span>
              </div>
              <span className="text-xs">service management group</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
