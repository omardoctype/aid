# عيادي - Frontend MVP

Landing page e-commerce frontend for personalized Eid al-Adha kids T-shirts.
The project is **frontend-only** and deployable on Vercel static hosting.

## Project Description

`عيادي` lets parents:
- discover the service and style options
- upload a child photo
- submit a personalized order
- trigger Cloudinary image upload
- send order details via EmailJS
- confirm manually on WhatsApp

No backend, no serverless functions, no private keys in code.

## Features

- Responsive landing page (mobile, tablet, desktop)
- Sticky header with smooth-scroll navigation
- Premium brand UI using olive + gold + cream palette
- Full validated order form
- Client-side image validation:
  - image only
  - allowed formats: JPG, JPEG, PNG, WEBP
  - max size: 5 MB
- Local image preview before submit
- Cloudinary unsigned upload
- EmailJS order email sending
- Success and error states
- Manual WhatsApp confirmation button after success
- Floating WhatsApp quick-contact button (optional render if env number exists)

## Tech Stack

- React + Vite
- Tailwind CSS
- Cloudinary unsigned upload API
- EmailJS (`@emailjs/browser`)
- Vercel static deployment

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create `.env` at project root (copy from `.env.example`) and fill values:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=aid_orders_unsigned
VITE_EMAILJS_SERVICE_ID=service_o1l9paa
VITE_EMAILJS_TEMPLATE_ID=template_j2kdm7e
VITE_EMAILJS_PUBLIC_KEY=GhqZyEOTZTk2F7WI8
VITE_WHATSAPP_NUMBER=21629850995
```

3. Run locally:

```bash
npm run dev
```

4. Build production bundle:

```bash
npm run build
```

## Environment Variables

Required Vite env variables:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_WHATSAPP_NUMBER`

Notes:
- Never add Cloudinary API secret to frontend code.
- Never add EmailJS private keys to frontend code.
- `.env` and `.env.local` are ignored by git.

## Vercel Deployment

1. Push repository to GitHub/GitLab/Bitbucket.
2. Import project in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add all `VITE_*` variables in Vercel Project Settings > Environment Variables.
7. Deploy.

Because the app is frontend-only, no backend configuration is needed.

## Production Notes

- The form does not store child photos in localStorage.
- Sensitive order data is not logged to console.
- WhatsApp is user-triggered only (no forced popup/open).
