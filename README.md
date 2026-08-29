# Campus Harvest Hub

Build a complete, production-grade, multi-page web application for "ZeroDrop" - a hyper-local campus food waste reduction & dynamic decay marketplace.

The application must implement full client-side routing (React Router), responsive navigation (Header, Sidebar, Mobile Drawer, Footer), and persistent mock state management for realistic interactive flows across all necessary application modules.

THEME & DESIGN SYSTEM:

- Aesthetic: Modern, eco-conscious campus platform.

- Color Palette: Eco Emerald Green (Primary), Warm Amber (Urgency/Dynamic Pricing), Deep Slate/Dark Mode backgrounds.

COMPLETE PAGE ARCHITECTURE & ROUTES TO IMPLEMENT:

1. PUBLIC & MARKETING FLOW:

- / : Landing Page (Hero banner with live countdown stats, core value proposition, interactive "How It Works" for students & vendors, campus impact counters).

- /about : Mission & Food Waste Vision (Interactive campus impact modeler, story, zero-waste statistics).

- /how-it-works : Visual step-by-step guide for both Student self-pickup and Vendor clearance onboarding.

- /faq : Frequently Asked Questions (Food quality, hygiene standards, pickup windows, refund/cancellation policies).

2. AUTHENTICATION & ONBOARDING FLOW:

- /login : Dual-role Auth Portal with smooth tab toggles (Student Roll No/Email vs Vendor Canteen ID).

- /register/student : Student Sign-up (Campus verification, email/roll number input, dormitory/hostel block selection).

- /register/vendor : Vendor Onboarding (Canteen name, campus block/location, stall number, FSSAI/Food license verification upload state).

- /forgot-password : Password recovery flow with OTP mock verification screen.

3. STUDENT MARKETPLACE, PAYMENT & SHOPPING FLOW:

- /marketplace : Main Catalog View. Real-time search, filter by campus zones/canteens, dietary tags (Veg, Non-Veg, Jain, Bakery), price ranges.

- /item/:id : Deep-dive Product Page featuring large images, vendor location details, live dynamic price decay graph (price vs time curve), active countdown timer, remaining stock ticker, quantity selector, and Customer Ratings & Reviews section (Star ratings, student feedback tags).

- /checkout/:id : Multi-Method Checkout Screen. 

  * Options: Pay at Counter (Self-Pickup Cash) OR Online Payment Gateway (UPI ID, QR Code payment simulation, Campus Wallet / Cards).

  * Pickup time window selector and terms agreement.

- /order-confirmation/:id : Instant Pass Screen. Generates unique order verification code + QR code, live pickup timer countdown, address map locator, and instant "Send Order to Vendor via WhatsApp" direct deep link.

4. STUDENT DASHBOARD, RATINGS & USER PORTAL:

- /student/orders : Active & Past Orders History. 

  * Tabs for "Pending Pickup", "Completed", and "Cancelled".

  * For completed orders: Add an interactive "Rate & Review Food" button opening a popup modal to give 1-5 Star Ratings, food freshness feedback, and written reviews.

- /student/favorites : Saved favorite canteens and items with price drop push notification toggles.

- /student/impact : Personal Eco Dashboard. Tracks individual money saved (₹), total food waste prevented (kg), and CO2 offset metrics.

- /student/profile : Student account settings, campus block details, and notification preferences (WhatsApp/SMS alerts).

5. NEED HELP & CALCULATOR TOOL (/help):

- Interactive Help & Campus Waste Calculator:

  * Help Center FAQ & Chatbot Simulation UI.

  * Interactive Campus Calculator Section: Canteen owners or event managers input "Expected Footfall" and "Fest/Event Duration", and the tool outputs:

    1. Estimated food quantity required (to stop wastage).

    2. Power/energy consumption estimates.

    3. Custom waste management guidelines.

6. VENDOR OPERATIONAL DASHBOARD FLOW:

- /vendor/dashboard : Command Center. High-level metric cards (Today's Cost Recovered, Items Sold, Surplus Saved, Active Listings, Average Star Rating) + live sales performance line graph.

- /vendor/add-item : Quick 10-Second Listing Tool. Simple inputs for Item Name, Category, Initial Quantity, Original Price, Base Discounted Price, Closing Time, and Dynamic Decay Speed preset toggle ("Standard 30-min drops" vs "Aggressive 10-min drops").

- /vendor/inventory : Active Inventory Management. Real-time stock decrementor, manual "Mark Sold Out" triggers, and price override options.

- /vendor/verify-order : Order Verification Portal. Built-in scanner UI / Order Code manual input to quickly validate student passes and mark orders as "Picked Up".

- /vendor/payouts : Financial & Online Payment Settlement Log. Daily online UPI revenue breakdown, transaction logs, and payout settlement status.

- /vendor/reviews : Customer Feedback & Rating Analytics. View student star ratings, food quality reviews, and direct response triggers.

7. CAMPUS ADMIN & ANALYTICS OVERVIEW:

- /admin/analytics : Campus-wide Sustainability Metrics. Overall waste reduction leaderboard across all participating canteens, peak clearance hours data, and overall environmental report exporter.

FUNCTIONAL & INTERACTIVE REQUIREMENTS:

- Global Header & Footer navigation seamlessly linking all these pages.

- Dynamic Price Decay Simulation: Real-time countdown timers ticking on item cards, visually updating current prices and progress bars.

- Fully mobile-responsive layout across all screens with interactive toast notifications for actions (payment success, ratings submitted, listing items, verifying passes).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a227dba6-5397-4970-ab86-541a522e9a40).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
