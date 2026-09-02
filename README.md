# Letters by Anisha

A literary portfolio, Bookstagram media kit, and content platform for **Anisha** — book reviewer, writer, and English Literature postgraduate. Built with Next.js (App Router), Tailwind CSS, and Sanity CMS.

---

## ✨ Features

- **Editorial Design**: Warm literary aesthetic with custom typography (Playfair, Caveat, Cormorant Garamond, Plus Jakarta Sans).
- **Curated Reading Shelf (`/shelf`)**: Filterable book recommendations and favorites.
- **Book Reviews (`/reviews`)**: Dedicated reviews hub with ratings and tags.
- **Writing Portfolio (`/writing`)**: Original essays, literary prose, and think-pieces.
- **Creator Media Kit**: Dynamic stats, brand collaboration showcase, and press highlights.
- **Interactive Contact**: Working contact form powered by **Resend** with server-side Zod validation.
- **Embedded Sanity Studio (`/studio`)**: Headless CMS directly accessible within the app for real-time editorial workflow.
- **On-Demand ISR**: Sanity webhook endpoint (`/api/revalidate`) for instant cache revalidation without full rebuilds.
- **SEO & Social Cards**: Dynamic Open Graph images, metadata generation, sitemap, and robots.txt.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **CMS** | [Sanity Studio v5](https://www.sanity.io/) (`next-sanity`, Sanity Typegen) |
| **Email** | [Resend](https://resend.com/) + [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Analytics** | [@vercel/analytics](https://vercel.com/analytics) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: 20.x or higher
- **npm** / **pnpm** / **yarn**

### 2. Installation

```bash
git clone <repository-url>
cd letters-by-anisha
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-01-01"
SANITY_REVALIDATE_SECRET="your_sanity_webhook_secret"

# Resend (Contact Form)
RESEND_API_KEY="re_your_resend_api_key"
CONTACT_EMAIL_TO="your_email@example.com"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site, or [http://localhost:3000/studio](http://localhost:3000/studio) to access Sanity Studio.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts local Next.js development server |
| `npm run build` | Builds application for production |
| `npm run start` | Runs the compiled production build locally |
| `npm run lint` | Runs ESLint checks |
| `npm run typegen` | Generates TypeScript types from Sanity schemas |

---

## 📂 Project Structure

```text
letters-by-anisha/
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── api/              # Contact (Resend) & Revalidate webhooks
│   ├── reviews/          # Book reviews page
│   ├── shelf/            # Bookshelf & recommendations page
│   ├── studio/           # Embedded Sanity Studio route
│   └── writing/          # Essays and prose pieces
├── components/           # Reusable UI components & section layouts
├── lib/                  # Utilities (OG image generation, helpers)
├── sanity/               # Sanity schemas, client, structure, & typegen
│   └── schemaTypes/      # Content models (about, reviews, posts, collabs)
└── public/               # Static assets & icons
```

---

## 🔒 Webhook Revalidation

To automatically invalidate Next.js cache when content updates in Sanity:

1. In Sanity Project Settings, add a Webhook pointing to:  
   `https://<your-domain>/api/revalidate`
2. Set the secret to match `SANITY_REVALIDATE_SECRET`.
3. The route verifies webhook signatures using `@sanity/webhook` and tags: `settings`, `posts`, `reviews`, `collabs`, `writing`, and `about`.
