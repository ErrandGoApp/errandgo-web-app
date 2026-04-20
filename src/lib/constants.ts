import { FaFacebook } from "react-icons/fa";
import { RiGithubFill, RiInstagramFill, RiTwitterXFill } from "react-icons/ri";
import type { IconType } from "react-icons";
import { PiTiktokLogoFill } from "react-icons/pi";

export interface NavLink {
  title: string;
  href: string;
}

interface Accordion {
  id: string;
  title: string;
  content: string[];
}

export const NAV_LINKS: NavLink[] = [
  { title: "Features", href: "/#features" },
  { title: "How It Works", href: "/#how-it-works" },
  { title: "FAQs", href: "/#faqs" },
];

export const FOOTER_LINKS: {
  href: string;
  icon: IconType;
  label: string;
}[] = [
  {
    href: "https://github.com/orgs/ErrandGoApp/repositories",
    icon: RiGithubFill,
    label: "GitHub",
  },
  {
    href: "https://www.instagram.com/errandgoapp",
    icon: RiInstagramFill,
    label: "Instagram",
  },
  {
    href: "https://www.x.com/errandgoapp",
    icon: RiTwitterXFill,
    label: "X",
  },
  {
    href: "https://www.tiktok.com/@errandgoapp",
    icon: PiTiktokLogoFill,
    label: "TikTok",
  },
  {
    href: "https://www.facebook.com/errandgoapp",
    icon: FaFacebook,
    label: "Facebook",
  },
];

export const GET_HELP_USE_CASES = [
  "Check prices in a market before you go",
  "Confirm item availability and prices",
  "Verify property or item condition",
  "Make quick enquiries at offices or service centers",
  "Small runs, or “just help me check” tasks",
];

export const HELP_AND_EARN_USE_CASES = [
  "Grab errands around your neighborhood",
  "Make money during your free hours as a rider",
  "Earn between classes as a student",
  "Turn your spare time into extra income",
  "Build trust and get chosen more often",
];

export const ERRAND_CREATOR = [
  "Save time and transportation costs",
  "Get help anywhere you are unable to reach",
  "Compare bids instead of paying fixed fees",
  "Real-time update & proof of actions",
];

export const ERRAND_HELPER = [
  "Flexible earnings",
  "Simple and seamless onboarding",
  "Build consistent income from everyday errands",
  "Work around your schedule",
];

export const FAQs: Accordion[] = [
  {
    id: "item-1",
    title: "How does ErrandGo work?",
    content: [
      "ErrandGo connects people who need quick help with those willing to assist. As an errand creator, you post what you need and set your budget. Errand helpers then place their bids, you choose the best one, and they complete the task while sharing updates. Helpers earn after the errand is confirmed.",
    ],
  },
  {
    id: "item-2",
    title: "What types of errands can I request?",
    content: [
      `<ul class="space-y-2 list-disc">
          		<li>Check prices in a market before you go</li>
          		<li>Property or item condition verification</li>
          		<li>Item availability and prices’ confirmation</li>
          		<li>Quick enquiries at offices or service centers</li>
          		<li>Small runs, or “just help me check” tasks</li>
				<li>If it’s simple, legal, and location-based, you can post it on ErrandGo</li>
        	</ul>`,
    ],
  },
  {
    id: "item-3",
    title: "How much can I earn as an errand helper?",
    content: [
      "Your earnings depend on the errands you accept. Each errand shows the amount the requester is offering, and you keep the money once the task is completed and confirmed. The more errands you take, the more you earn. Some helpers make steady daily or weekly income.",
    ],
  },
  {
    id: "item-4",
    title: "How do I become an errand helper and start earning?",
    content: [
      `<div class="space-y-2">
			    <p>Becoming a helper is simple:</p>
				<ol class="space-y-2 list-decimal pl-6">
				  <li>Download the ErrandGo app</li>
          		  <li>Sign up and complete your profile</li>
          		  <li>Verify your identity and mobile number</li>
          		  <li>Show interest in available errands</li>
          		  <li>Complete assigned errand and get paid</li>
				</ol>
          		
        	</div>`,
    ],
  },
  {
    id: "item-5",
    title: "Can I post an errand for a location I am not physically in?",
    content: [
      "Yes. You can post an errand from anywhere as long as the errand’s location is accurate. Helpers in that area will see your request and can complete it on your behalf—even if you are in a different city or country.",
    ],
  },
  {
    id: "item-6",
    title: "What happens if a helper does not complete an errand?",
    content: [
      `<div class="space-y-2">
			    <p>If a helper cannot complete the task or cancels an errand:</p>
			    <ul class="space-y-2 list-disc pl-6">
				  <li>The errand automatically becomes available for other helpers</li>
          		  <li>You are not charged</li>
          		  <li>You can repost the errand anytime</li>
				</ul>
          		<p>To keep things safe, helpers who repeatedly do not fulfill tasks assigned to them may lose access to the platform</p>
        	</div>`,
    ],
  },
];

export const PRIVACY_POLICY: Accordion[] = [
  {
    id: "item-1",
    title: "Introduction",
    content: [
      `Welcome to ErrandGo (also referred to as "the App"). This Privacy Policy explains how TINKERPAL LLC ("we," "us," or "our") collects, uses, and protects your information when you use our mobile application and services. ErrandGo is a proprietary product owned and operated by TINKERPAL LLC. We are committed to transparency and compliance with global privacy standards, including the General Data Protection Regulation (GDPR) and the Nigeria Data Protection Regulation (NDPR).`,
    ],
  },
  {
    id: "item-2",
    title: "Who We Are",
    content: [
      `<div class="space-y-2">
          		<p><strong>Data Controller:</strong> TINKERPAL LLC</p>
          		<p><strong>Product Name:</strong> ErrandGo</p>
          		<p><strong>Physical Address:</strong> 11106 Continental Ave, Cleveland, OH, US</p>
          		<p><strong>D-U-N-S Number:</strong> 14-490-1000</p>
          		<p><strong>Contact Email:</strong> support@errandgo.app</p>
        	</div>`,
    ],
  },
  {
    id: "item-3",
    title: "Information We Collect",
    content: [
      `<div class="space-y-4">
          		<div>
          		  <h4 class="font-semibold mb-2">A. Information You Provide to Us</h4>
          		  <ul class="space-y-2">
          		    <li><strong>Identity Data:</strong> Your name, phone number (for OTP authentication), and email address (via Google Sign-In).</li>
          		    <li><strong>Profile Media:</strong> Profile photos you upload to identify yourself to other users or Service Providers.</li>
          		    <li><strong>Task Evidence:</strong> Photos, videos, and audio recordings you upload to verify errand completion or provide task details.</li>
          		    <li><strong>Financial & Payout Data:</strong> Payment method details and banking/mobile money account details for transactions and payouts.</li>
          		  </ul>
          		</div>
          		<div>
          		  <h4 class="font-semibold mb-2">B. Information We Collect Automatically</h4>
          		  <ul class="space-y-2">
          		    <li><strong>Location Data:</strong> Precise location while using the app, and background location for Service Providers to enable job alerts and real-time tracking.</li>
          		    <li><strong>Device Information:</strong> Device model, OS version, IP address, and unique device identifiers.</li>
          		    <li><strong>Usage Data:</strong> Logs of app interactions, crash reports, and performance metrics.</li>
          		  </ul>
          		</div>
          		<div>
          		  <h4 class="font-semibold mb-2">C. Local Storage</h4>
          		  <p>We use Isar Database to store notification logs and app preferences locally on your device for offline functionality.</p>
          		</div>
        	</div>`,
    ],
  },
  {
    id: "item-4",
    title: "How We Use Your Information",
    content: [
      `<ul class="space-y-2">
          		<li><strong>Service Delivery:</strong> Match Requesters with nearby Service Providers using geolocation.</li>
          		<li><strong>Transaction Facilitation:</strong> Process payments, deduct fees, and disburse earnings to Service Providers.</li>
          		<li><strong>Task Verification:</strong> Process evidence to ensure service completion before payouts.</li>
          		<li><strong>Communication:</strong> Send push notifications about order updates, bids, and messages.</li>
          		<li><strong>Analytics:</strong> Improve app stability and fix crashes.</li>
          		<li><strong>Fraud Prevention:</strong> Detect suspicious activity and multiple accounts.</li>
        	</ul>`,
    ],
  },
  {
    id: "item-5",
    title: "Third-Party Data Sharing",
    content: [
      `We do not sell your personal data. We share data only with trusted third-party services:`,
      `<div>
  				<!-- Desktop Table -->
  				<div class="hidden md:block overflow-x-auto rounded-lg border border-gray-100">
  				  <table class="min-w-full text-sm">
  				    <thead class="bg-purple-600 text-white">
  				      <tr>
  				        <th class="px-4 py-3 text-left font-semibold">Service</th>
  				        <th class="px-4 py-3 text-left font-semibold">Purpose</th>
  				        <th class="px-4 py-3 text-left font-semibold">Data Shared</th>
  				      </tr>
  				    </thead>
  				    <tbody class="divide-y divide-gray-100 bg-white">

  				      <tr class="hover:bg-gray-50 transition">
  				        <td class="px-4 py-3 font-medium text-gray-900">Google Cloud / Firebase</td>
  				        <td class="px-4 py-3">Authentication, Database, Push Notifications</td>
  				        <td class="px-4 py-3">User ID, Email, Device ID, Crash Logs</td>
  				      </tr>

  				      <tr class="hover:bg-gray-50 transition">
  				        <td class="px-4 py-3 font-medium text-gray-900">Google Maps SDK</td>
  				        <td class="px-4 py-3">Location Tracking & Distance Calculation</td>
  				        <td class="px-4 py-3">Precise Location Data</td>
  				      </tr>

  				      <tr class="hover:bg-gray-50 transition">
  				        <td class="px-4 py-3 font-medium text-gray-900">Firebase Crashlytics</td>
  				        <td class="px-4 py-3">App Stability & Crash Reporting</td>
  				        <td class="px-4 py-3">Crash Logs, Device State</td>
  				      </tr>

  				      <tr class="hover:bg-gray-50 transition">
  				        <td class="px-4 py-3 font-medium text-gray-900">Payment Processors</td>
  				        <td class="px-4 py-3">Payment Processing & Payouts</td>
  				        <td class="px-4 py-3">Transaction IDs, Amount, Payout Details</td>
  				      </tr>

  				    </tbody>
  				  </table>
  				</div>

  				<!-- Mobile Card Layout -->
  				<div class="md:hidden flex flex-col gap-4">

  				  <div class="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
  				    <h4 class="font-semibold text-gray-900 mb-1">Google Cloud / Firebase</h4>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Purpose:</span> Authentication, Database, Push Notifications</p>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Data Shared:</span> User ID, Email, Device ID, Crash Logs</p>
  				  </div>

  				  <div class="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
  				    <h4 class="font-semibold text-gray-900 mb-1">Google Maps SDK</h4>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Purpose:</span> Location Tracking & Distance Calculation</p>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Data Shared:</span> Precise Location Data</p>
  				  </div>

  				  <div class="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
  				    <h4 class="font-semibold text-gray-900 mb-1">Firebase Crashlytics</h4>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Purpose:</span> App Stability & Crash Reporting</p>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Data Shared:</span> Crash Logs, Device State</p>
  				  </div>

  				  <div class="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
  				    <h4 class="font-semibold text-gray-900 mb-1">Payment Processors</h4>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Purpose:</span> Payment Processing & Payouts</p>
  				    <p class="text-gray-600 text-sm"><span class="font-semibold">Data Shared:</span> Transaction IDs, Amount, Payout Details</p>
  				  </div>

  				</div>
			
			</div>`,
    ],
  },
  {
    id: "item-6",
    title: "Permissions We Request",
    content: [
      `<ul class="space-y-2">
          		<li><strong>Location:</strong> Required to match users and track errands.</li>
          		<li><strong>Camera & Microphone:</strong> Required to capture proof of work or voice instructions.</li>
          		<li><strong>Photo Library:</strong> Required to upload images for profile or task details.</li>
          		<li><strong>Notifications:</strong> Required to alert you of bids, acceptances, and payments.</li>
        	</ul>`,
    ],
  },
  {
    id: "item-7",
    title: "Data Retention & Account Deletion",
    content: [
      ` <div class="space-y-2">
          		<p>We retain your personal data only as long as you have an active account.</p>
          		<p><strong>Right to Delete:</strong> You have the right to request deletion of your account and data at any time.</p>
          		<p><strong>How to Delete:</strong> Initiate deletion in App settings or visit our deletion portal.</p>
          		<p><strong>Data Removal:</strong> We will permanently delete your information within 30 days, except transaction records required by law.</p>
        	</div>`,
    ],
  },
  {
    id: "item-8",
    title: "Children's Privacy",
    content: [
      `<p>Our Service is not directed to individuals under the age of 13 (or 18, depending on local jurisdiction). We do not knowingly collect personal data from children. If we become aware that a child has provided us with personal data, we will take steps to delete such information.</p>`,
    ],
  },
  {
    id: "item-9",
    title: "Changes to This Policy",
    content: [
      ` <p>We reserve the right to update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>`,
    ],
  },
  {
    id: "item-10",
    title: "Contact Us",
    content: [
      `<p class="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
          	<div class="space-y-3">
            	<p><strong>Email:</strong> support@errandgo.app</p>
	           	<p><strong>Mail:</strong> TINKERPAL LLC, 11106 Continental Ave, Cleveland, OH, US</p>
          	</div>`,
    ],
  },
];
