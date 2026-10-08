# MuheezTalks Books Platform

A full-stack digital books platform built with Next.js, Supabase, Paystack, and Resend.

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Database & Auth**: Supabase
- **Payments**: Paystack (NGN)
- **Email**: Resend
- **Hosting**: Railway
- **PDF Processing**: pdf-lib (watermarking)

## Features

- 🔐 Auth (signup, login, forgot password)
- 📚 Book store with cover images
- 💳 Paystack payment integration (Naira)
- 📖 Online PDF reader with session tracking
- ⬇️ Watermarked PDF downloads (buyer name + MuheezTalks branding)
- 📊 Reading analytics (time tracked, points earned)
- 📧 Transactional emails (welcome, purchase confirmation, support)
- 🛡️ Admin dashboard (upload books, manage users)
- 🆓 Free book support (bypasses payment)

## Environment Variables

Add these to Railway:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=https://yourdomain.com


## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (redirects to dashboard if logged in) |
| `/dashboard` | User library |
| `/books/[id]` | Book detail & purchase |
| `/read/[id]` | Online PDF reader |
| `/dashboard/admin` | Admin panel |
| `/auth/login` | Login |
| `/auth/signup` | Signup |
| `/support` | Support form |

## Deployment

```bash
railway up
```

## Todo

- [ ] Add Paystack secret key to Railway
- [ ] Add Resend API key to Railway
- [ ] Connect custom domain
- [ ] Update email `from` address to custom domain
