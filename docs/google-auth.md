# Google authentication setup

MatchPulse uses Supabase Auth for email/password and Google OAuth sign-in. The app code is already wired to call `supabase.auth.signInWithOAuth({ provider: 'google' })`; the remaining setup is in Google Cloud, Supabase, and deployment environment variables.

For email confirmation, invite, magic link, and password reset delivery through the project domain, see [Brevo SMTP setup for Supabase Auth](./brevo-smtp.md).

## 1. Configure Google Cloud OAuth

1. Open the [Google Auth Platform](https://console.cloud.google.com/auth/overview) for your Google Cloud project.
2. Configure the consent screen:
   - App name: `MatchPulse`
   - User support email: your support email
   - Developer contact information: your email
3. In **Data Access / Scopes**, include:
   - `openid`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
4. Create an OAuth client:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - Local development: `http://localhost:5173`
     - Production: your deployed app origin, for example `https://matchpulse.example.com`
   - Authorized redirect URIs:
     - Copy the **Callback URL (for OAuth)** from Supabase's Google provider screen, for example:
       `https://<project-ref>.supabase.co/auth/v1/callback`
5. Copy the generated **Client ID** and **Client Secret**.

## 2. Enable Google in Supabase

1. Open Supabase Dashboard -> **Authentication** -> **Providers** -> **Google**.
2. Turn on **Enable Sign in with Google**.
3. Paste the Google OAuth **Client ID** into **Client IDs**.
   - This must look like `1234567890-abcdef.apps.googleusercontent.com`.
   - Do not enter an email address here. If Supabase shows "Invalid characters", the value is not a Google OAuth client ID.
   - If you add native Android, iOS, One Tap, or Chrome extension clients later, enter each Google client ID separated by commas.
4. Paste the Google OAuth **Client Secret** into **Client Secret (for OAuth)**.
5. Leave **Skip nonce checks** off for this web app.
6. Save the provider settings.

## 3. Configure Supabase redirect URLs

In Supabase Dashboard -> **Authentication** -> **URL Configuration**:

1. Set **Site URL** to your app URL:
   - Local only: `http://localhost:5173`
   - Production: your deployed app URL
2. Add **Redirect URLs** for every origin you use:
   - `http://localhost:5173`
   - Your production URL
   - Any preview deployment URL pattern you use

The app redirects back to `window.location.origin`, so each origin that can start Google sign-in must be allowed by Supabase.

## 4. Configure app environment variables

Create `.env.local` for local development:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values in your hosting provider for production. Do not expose the Supabase service role key in frontend environment variables.

## 5. Verify the flow

1. Start the app locally with `npm run dev`.
2. Open `http://localhost:5173`.
3. Click **Sign Up** or **Sign In**.
4. Click **Continue with Google**.
5. Complete Google's consent flow.
6. Confirm that the app returns to MatchPulse and continues into onboarding or the dashboard.

If Google rejects the redirect, compare the error URL with the redirect URI registered in Google Cloud and the redirect URLs configured in Supabase.
