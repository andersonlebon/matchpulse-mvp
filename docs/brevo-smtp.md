# Brevo SMTP setup for Supabase Auth

MatchPulse sends Supabase Auth emails through Brevo so confirmation, invite, magic link, and password reset emails come from the project domain instead of Supabase's built-in test sender.

Use this guide when configuring or troubleshooting:

- Supabase Auth confirmation emails
- Supabase invite emails
- Password reset emails
- Magic link / OTP emails
- Brevo sender domain authentication

## 1. Verify the sending domain in Brevo

1. Open Brevo.
2. Go to **Settings** -> **Senders, domains, IPs**.
3. Open the **Domains** tab.
4. Add the domain used for auth emails, for example:

   ```txt
   matchpuls.live
   ```

5. Brevo will generate DNS records for domain authentication. These usually include:
   - DKIM records
   - SPF record
   - DMARC record
   - Optional tracking CNAME records

## 2. Add Brevo DNS records in Vercel

1. Open Vercel Dashboard.
2. Go to **Domains**.
3. Select the domain.
4. Open **DNS Records**.
5. Add each record Brevo provides.

When adding records in Vercel, enter the host/name without the root domain if Vercel already shows the selected domain.

Example:

```txt
Brevo name: brevo1._domainkey.matchpuls.live
Vercel name: brevo1._domainkey
```

Example:

```txt
Brevo name: _dmarc.matchpuls.live
Vercel name: _dmarc
```

For SPF, only one SPF TXT record should exist per domain. If there is already an SPF record, merge Brevo into the existing value instead of creating a second SPF record.

Example merged SPF:

```txt
v=spf1 include:spf.brevo.com include:_spf.google.com ~all
```

After adding the records, return to Brevo and click **Authenticate** or **Verify**. DNS verification can take several minutes.

## 3. Create or verify the Brevo sender

1. In Brevo, go to **Settings** -> **Senders, domains, IPs**.
2. Open the **Senders** tab.
3. Add or verify the auth sender address:

   ```txt
   noreply@matchpuls.live
   ```

4. Confirm the sender status is **Verified**.
5. Confirm DKIM and DMARC show as configured for the domain.

## 4. Create a Brevo SMTP key

1. In Brevo, go to **SMTP & API**.
2. Open the **SMTP** section.
3. Copy the SMTP login.
4. Create a new SMTP key if needed.
5. Store the SMTP key securely. Brevo only shows the full key once.

Use the SMTP key as the SMTP password. Do not use the Brevo account password or a Brevo API key.

## 5. Configure Supabase custom SMTP

1. Open Supabase Dashboard.
2. Go to **Authentication** -> **Emails**.
3. Enable custom SMTP.
4. Enter the sender details:

   ```txt
   Sender email address: noreply@matchpuls.live
   Sender name: Matchpulse
   ```

5. Enter Brevo SMTP settings:

   ```txt
   Host: smtp-relay.brevo.com
   Port: 587
   Username: <Brevo SMTP login>
   Password: <Brevo SMTP key>
   Minimum interval per user: 60 seconds
   ```

6. Save the settings.

## 6. Configure Supabase rate limits

After custom SMTP is enabled, Supabase may start with a conservative rate limit. Open:

```txt
Authentication -> Rate Limits
```

Set the email send rate to a value that stays under the Brevo account limit.

For Brevo's free plan, a safe starting point is:

```txt
12 emails per hour
```

This stays below the free plan's 300 emails/day allowance.

## 7. Test the flow

1. In Supabase, go to **Authentication** -> **Users**.
2. Invite a test user or create a signup through the app.
3. Open Brevo **Transactional** -> **Logs**.
4. Confirm the email appears in Brevo logs.
5. Confirm the recipient receives the email.

## Troubleshooting

### `525 5.7.1 Unauthorized IP address`

This means Brevo blocked the Supabase server IP from using the SMTP key.

Fix it in Brevo:

1. Go to **Settings** -> **Security** -> **Authorized IPs**.
2. Either authorize the blocked Supabase IP from the Brevo unauthorized IP list, or deactivate unauthorized IP blocking for SMTP keys.
3. Retry the Supabase invite/signup email.

For Supabase-hosted Auth, deactivating SMTP IP blocking can be simpler because the outbound Supabase IP may change over time.

### `535 Authentication failed`

Check that Supabase is using:

```txt
Username: Brevo SMTP login
Password: Brevo SMTP key
```

The password must not be the Brevo account password.

### Sender rejected or sender not verified

Confirm the exact sender email configured in Supabase is verified in Brevo:

```txt
noreply@matchpuls.live
```

Also confirm DKIM and DMARC are configured for the domain.

### Emails do not appear in Brevo logs

Supabase did not successfully connect to Brevo. Check:

- SMTP host
- SMTP port
- SMTP username
- SMTP key
- Brevo SMTP IP authorization settings

### Emails appear in Brevo logs but do not arrive

Brevo accepted the email. Check:

- Recipient spam folder
- Brevo event status
- Brevo bounce or blocked contact status
- Domain DKIM/SPF/DMARC verification
