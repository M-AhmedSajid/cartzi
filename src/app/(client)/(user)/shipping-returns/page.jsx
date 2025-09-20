import React from "react";

const ShippingReturnsPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">Shipping & Returns</h1>
        
        {/* Shipping Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-6">Shipping Information</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Processing Time</h3>
              <p className="text-muted-foreground">
                Orders are typically processed within 1-2 business days. During peak seasons or sales, processing may take 3-5 business days.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Shipping Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Standard Shipping</h4>
                  <p className="text-muted-foreground text-sm mb-2">5-7 business days</p>
                  <p className="text-foreground font-medium">$5.99</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Express Shipping</h4>
                  <p className="text-muted-foreground text-sm mb-2">2-3 business days</p>
                  <p className="text-foreground font-medium">$12.99</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Overnight Shipping</h4>
                  <p className="text-muted-foreground text-sm mb-2">Next business day</p>
                  <p className="text-foreground font-medium">$24.99</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Free Shipping</h4>
                  <p className="text-muted-foreground text-sm mb-2">Orders over $75</p>
                  <p className="font-medium text-green-600">FREE</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Shipping Destinations</h3>
              <p className="text-muted-foreground mb-3">
                We currently ship to the following locations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>All 50 United States</li>
                <li>Canada</li>
                <li>United Kingdom</li>
                <li>European Union countries</li>
                <li>Australia and New Zealand</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Tracking Your Order</h3>
              <p className="text-muted-foreground">
                Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order through your account dashboard.
              </p>
            </div>
          </div>
        </section>
        
        {/* Returns Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-6">Returns & Exchanges</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Return Policy</h3>
              <p className="text-muted-foreground">
                We want you to love your purchase! If you're not completely satisfied, you can return most items within 30 days of delivery for a full refund or exchange.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Return Requirements</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Items must be unworn, unwashed, and in original condition</li>
                <li>All original tags and packaging must be attached</li>
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Items must be returned within 14 days of return approval</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Non-Returnable Items</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Sale or clearance items (unless defective)</li>
                <li>Personal care items and accessories</li>
                <li>Custom or personalized items</li>
                <li>Items marked as final sale</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How to Return</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">1</span>
                  <p className="text-muted-foreground">Log into your account and go to "Order History"</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">2</span>
                  <p className="text-muted-foreground">Select the order and items you want to return</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">3</span>
                  <p className="text-muted-foreground">Print the return label and package your items</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">4</span>
                  <p className="text-muted-foreground">Drop off at any authorized shipping location</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Refund Processing</h3>
              <p className="text-muted-foreground">
                Refunds are typically processed within 5-7 business days after we receive your return. You'll receive an email confirmation once the refund is processed.
              </p>
            </div>
          </div>
        </section>
        
        {/* Exchanges Section */}
        <section>
          <h2 className="text-3xl font-semibold text-foreground mb-6">Exchanges</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Size Exchanges</h3>
              <p className="text-muted-foreground">
                Need a different size? We offer free size exchanges for the same item. Simply follow the return process and note that you'd like an exchange.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Exchange Process</h3>
              <p className="text-muted-foreground">
                Exchanges are processed once we receive your return. If the requested size is available, we'll ship it immediately. If not, we'll process a refund and notify you.
              </p>
            </div>
          </div>
        </section>
        
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-semibold text-foreground mb-4">Need Help?</h3>
          <p className="text-muted-foreground">
            If you have questions about shipping or returns, please contact our customer service team. We're here to help!
          </p>
          <p className="text-muted-foreground mt-2">
            <strong>Email:</strong> support@cartzi.vercel.app | <strong>Phone:</strong> +1 (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturnsPage;
