import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl text-center text-primary font-bold mb-6">
        Terms & Conditions
      </h1>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Wribate.com (the “Platform”), you agree to
            abide by these Terms & Conditions. If you do not agree, please do
            not use the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            2. User Responsibility for Content
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Users are solely responsible for any content (including Wribates,
              articles, comments, and multimedia) they post.
            </li>
            <li>
              All content must comply with applicable local, national, and
              international laws.
            </li>
            <li>
              Users must ensure that their content does not violate copyrights,
              trademarks, privacy rights, or any other legal protections.
            </li>
            <li>
              Hate speech, defamation, harassment, explicit content, and illegal
              activities are strictly prohibited.
            </li>
            <li>
              Users must verify the accuracy of their content before publishing
              to avoid spreading false or misleading information.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Compliance with Local Regulations
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Users must comply with the laws and regulations of their
              respective jurisdictions while using the Platform.
            </li>
            <li>
              If any content violates legal or regulatory requirements, the
              Platform reserves the right to remove the content and suspend or
              terminate the user’s account without prior notice.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. Licensing Agreement & Content Usage
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              By submitting content on the Platform, users grant Wribate.com and
              InnoRize EPL a non-exclusive, worldwide, perpetual, royalty-free
              license to publish, distribute, reproduce, monetize, and promote
              the content across its website, social media channels, and other
              platforms.
            </li>
            <li>
              Users waive any claims that Wribate.com and InnoRize EPL misused
              their content in any way.
            </li>
            <li>
              Users acknowledge that Wribate.com and InnoRize EPL have full
              discretion to modify, share, or monetize user-generated content
              (UGC) without requiring additional permission.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Privacy Policy & Data Protection
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Users accept and agree to Wribate.com’s legally-compliant Privacy
              Policy, which governs how personal data is collected, stored, and
              used.
            </li>
            <li>
              The Platform does not sell personal user data to third parties and
              ensures compliance with data protection laws (e.g., GDPR, CCPA).
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            6. Indemnification & Liability
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Users agree to indemnify, defend, and hold harmless Wribate.com,
              its affiliates, officers, employees, and partners from any claims,
              liabilities, damages, losses, costs, or expenses (including legal
              fees) arising from:
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Content posted by the user that violates laws or third-party
                  rights.
                </li>
                <li>
                  Misuse of the Platform or violation of these Terms &
                  Conditions.
                </li>
                <li>
                  Any dispute or legal action involving content uploaded by the
                  user.
                </li>
              </ul>
            </li>
            <li>
              Users will be held legally liable for any defamatory, false, or
              illegal content they create and publish on the Platform.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Moderation & Content Removal
          </h2>
          <p>
            Wribate.com reserves the right to review, modify, or remove any
            content that violates these Terms & Conditions. The Platform may use
            automated tools or manual review to ensure compliance with community
            guidelines. Users may report any content that they believe violates
            the terms for further review.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            8. Intellectual Property Rights
          </h2>
          <p>
            Users retain ownership of the content they post but grant
            Wribate.com a non-exclusive, worldwide, royalty-free license to
            display, distribute, and promote the content within the Platform.
            Users must not plagiarize or republish copyrighted content without
            proper authorization.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            9. Account Termination & Suspension
          </h2>
          <p>
            Violation of these Terms & Conditions may result in temporary or
            permanent suspension of user accounts. Wribate.com reserves the
            right to restrict access to any user who repeatedly violates the
            guidelines.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            10. Liability Disclaimer
          </h2>
          <p>
            Wribate.com is a platform for user-generated content and does not
            endorse, verify, or assume liability for any user-submitted content.
            Users agree to use the Platform at their own risk and acknowledge
            that Wribate.com is not responsible for any direct, indirect,
            incidental, or consequential damages arising from content posted on
            the site.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            11. Changes to Terms & Conditions
          </h2>
          <p>
            Wribate.com and InnoRize EPL may update these Terms & Conditions at
            any time. Continued use of the Platform constitutes acceptance of
            any modifications.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            12. Contact Information
          </h2>
          <p>
            For any questions or concerns regarding these Terms & Conditions,
            please contact us at
            <a
              href="mailto:support@wribate.com"
              className="text-blue-600 hover:underline ml-1"
            >
              support@wribate.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
