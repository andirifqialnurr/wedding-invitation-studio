# Marketplace Cart, Payment, and Template Download TODO

## Goal

Build a marketplace flow where users can select one or more wedding templates, pay for the cart, and download clean static template packages only after payment is confirmed by the server.

## Current Source Baseline

- [ ] Keep `app/marketplace-data.ts` as the first product catalog source until a database-backed catalog is added.
- [ ] Preserve `/template/[id]` as the live preview route.
- [ ] Replace the current simulated `/order/[id]` form flow with a cart and checkout flow.
- [ ] Add database tables because `db/schema.ts` is currently empty.
- [ ] Do not expose download access from frontend-only state.

## Task 1 - Product and Cart Model

- [ ] Add numeric price fields to marketplace products while preserving the current display price text.
- [ ] Add a cart state layer for adding, removing, and counting selected templates.
- [ ] Persist draft cart in local storage for anonymous browsing.
- [ ] Add cart badge/count to the marketplace header.
- [ ] Add `Add to Cart` actions to template catalog cards.
- [ ] Keep `Preview` separate from cart and checkout actions.
- [ ] Prevent duplicate cart rows for the same template unless a quantity model is explicitly needed.

## Task 2 - Cart Page

- [ ] Add `/cart` page with selected templates, unit prices, total, remove action, and checkout button.
- [ ] Show empty-cart state with a route back to the catalog.
- [ ] Make cart responsive for desktop and mobile.
- [ ] Keep the cart UI marketplace-focused, not a generic landing page.
- [ ] Add source-level tests or rendered HTML coverage for the cart route.

## Task 3 - Database Schema

- [ ] Add `orders` table with order number, customer contact, total amount, currency, and payment status.
- [ ] Add `order_items` table linked to purchased template IDs and prices at purchase time.
- [ ] Add `payments` table with provider, external reference, amount, status, raw event metadata, and timestamps.
- [ ] Add `download_entitlements` table or equivalent fields to track paid download access per order item.
- [ ] Add `download_artifacts` table or metadata for generated ZIP filename, checksum, storage path, and expiry policy.
- [ ] Generate and validate Drizzle migrations after schema changes.

## Task 4 - Checkout Flow

- [ ] Add `/checkout` page for customer name, email or WhatsApp, and order summary.
- [ ] Add server endpoint to create an order from the cart.
- [ ] Store order and item prices server-side before redirecting to payment.
- [ ] Add validation so unknown template IDs cannot be checked out.
- [ ] Keep order status as `pending_payment` until payment webhook confirms success.
- [ ] Clear cart only after order creation succeeds or after confirmed payment, based on chosen UX.

## Task 5 - Payment Gateway Integration

- [ ] Choose one payment gateway first, preferably Midtrans or Xendit for Indonesian payments.
- [ ] Add environment variables for gateway keys without committing secrets.
- [ ] Add server endpoint to create a payment session or invoice.
- [ ] Add webhook endpoint for payment status updates.
- [ ] Verify webhook signature before trusting payment status.
- [ ] Update order status from webhook, not from frontend redirect.
- [ ] Handle `paid`, `pending`, `expired`, `failed`, and refund/cancel statuses.
- [ ] Add idempotency guard so repeated webhook events do not duplicate entitlements.

## Task 6 - Paid Purchase Library

- [ ] Add `/purchases` page where users can view paid template purchases.
- [ ] Require an order token, email verification, login, or secure signed link before showing purchases.
- [ ] Show `Generate ZIP` only for paid order items.
- [ ] Show `Download ZIP` only after artifact generation succeeds.
- [ ] Do not expose unpaid template source URLs in page HTML or client state.

## Task 7 - Static Template Exporter

- [ ] Build an exporter that creates one clean package per template.
- [ ] Output structure should be `index.html`, `style.css`, `script.js`, `assets/`, and `README.md`.
- [ ] Export only the purchased template, not the full marketplace app.
- [ ] Remove marketplace, cart, order, and preview-only controls from exported packages.
- [ ] Include required images and flower assets with local relative paths.
- [ ] Keep template interactions that can run without React server/runtime.
- [ ] Add a validation script that opens or parses each generated package and checks asset references.

## Task 8 - ZIP Generation and Storage

- [ ] Add server-only endpoint to generate a ZIP for a paid order item.
- [ ] Generate ZIP files from the static exporter output, not from raw `dist`.
- [ ] Store generated ZIP in a private location or protected object storage.
- [ ] Add checksum and artifact metadata after generation.
- [ ] Return a short-lived signed download URL or protected download response.
- [ ] Block direct download if order item is not paid.
- [ ] Add rate limiting or retry protection around generation endpoints.

## Task 9 - Licensing and Buyer Package

- [ ] Add a license file to each ZIP package.
- [ ] Add a README explaining how to edit names, dates, photos, venue, and RSVP copy.
- [ ] Add allowed usage terms for one event or one client project.
- [ ] Add a simple changelog/version field per exported template.
- [ ] Add support contact or handoff note in the buyer package.

## Task 10 - Admin and Operations

- [ ] Add an admin view or script to inspect orders, payments, and generated downloads.
- [ ] Add manual re-generate action for failed ZIP generation.
- [ ] Add audit logs for payment webhook updates and download generation.
- [ ] Add monitoring for failed payments, failed webhooks, and failed ZIP builds.
- [ ] Add backup/export strategy for order and payment records.

## Task 11 - Validation Before Release

- [ ] Run TypeScript/build validation.
- [ ] Run rendered HTML tests for marketplace, cart, checkout, and purchases routes.
- [ ] Test unpaid user cannot generate or download ZIP.
- [ ] Test paid webhook unlocks only purchased templates.
- [ ] Test multi-template cart unlocks every paid item.
- [ ] Test generated ZIP works by opening `index.html` locally.
- [ ] Test mobile layout for catalog, cart, checkout, and purchases.
- [ ] Confirm no payment keys, tokens, or private download paths appear in client bundles.

## Suggested Implementation Order

1. Product/cart UI.
2. Cart page.
3. Database schema and order creation.
4. Payment gateway sandbox integration.
5. Webhook-verified paid status.
6. Purchase library.
7. Static exporter.
8. ZIP generation and protected download.
9. License/README package polish.
10. Admin and production hardening.
