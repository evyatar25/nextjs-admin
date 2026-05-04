# SiteGround Deployment

This project can be exported for SiteGround as static Next.js files plus PHP API files.

## 1. Configure PHP API

Before uploading, edit `public/api/config.php`:

- `ADMIN_PASSWORD`
- `EMAIL_TO`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`

Do not leave `ADMIN_PASSWORD` as `change-this-password`.

## 2. Build for SiteGround

From the `nextjs-app` folder:

```powershell
npm run build:siteground
```

This creates the `out` folder.

## 3. Upload

Upload the contents of `out` into SiteGround `public_html`.

Make sure these files exist on the server:

- `public_html/index.html`
- `public_html/api/leads.php`
- `public_html/api/login.php`
- `public_html/api/logout.php`
- `public_html/api/config.php`

## 4. Permissions

The PHP API stores leads in:

```text
public_html/api/data/leads.json
```

If leads are not saved, set write permissions on:

```text
public_html/api/data
```

## 5. Admin

Admin URL:

```text
https://your-domain.com/login
```

After login, go to:

```text
https://your-domain.com/admin/leads
```

