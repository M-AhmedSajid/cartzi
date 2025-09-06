import Container from "@/components/layout/Container";
import React from "react";

const TermsConditionsPage = () => {
  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Terms & Conditions
        </h1>
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing and using Cartzi's website and services, you accept
              and agree to be bound by the terms and provision of this
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Use License
            </h2>
            <p className="text-muted-foreground mb-3">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Cartzi's website for
              personal, non-commercial transitory viewing only.
            </p>
            <p className="text-muted-foreground">
              This is the grant of a license, not a transfer of title, and under
              this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempt to reverse engineer any software contained on the
                website
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Product Information
            </h2>
            <p className="text-muted-foreground">
              We strive to display accurate product information, including
              prices, descriptions, and availability. However, we do not warrant
              that product descriptions or other content is accurate, complete,
              reliable, current, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Pricing and Payment
            </h2>
            <p className="text-muted-foreground mb-3">
              All prices are shown in the local currency and are subject to
              change without notice. Payment must be made at the time of order
              placement.
            </p>
            <p className="text-muted-foreground">
              We accept major credit cards and other payment methods as
              indicated during checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Shipping and Delivery
            </h2>
            <p className="text-muted-foreground">
              Delivery times are estimates only. We are not responsible for
              delays beyond our control. Risk of loss and title for items pass
              to you upon delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Returns and Refunds
            </h2>
            <p className="text-muted-foreground">
              Please refer to our Returns Policy for detailed information about
              returning items and requesting refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Privacy Policy
            </h2>
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              In no event shall Cartzi or its suppliers be liable for any
              damages arising out of the use or inability to use the materials
              on the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Governing Law
            </h2>
            <p className="text-muted-foreground">
              These terms and conditions are governed by and construed in
              accordance with the laws of the jurisdiction in which Cartzi
              operates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting on the website.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              If you have any questions about these Terms & Conditions, please
              contact us.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TermsConditionsPage;
