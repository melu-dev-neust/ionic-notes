# Note IT: Ionic + PHP Procedural Notes REST API

A small learning/demo notes app. The frontend is an Ionic Angular standalone app (also built as an Android APK with Capacitor). The backend is a procedural PHP REST API using PDO and MySQL.

## Features
- Register, log in, and log out with token-based authentication
- Create, edit, move, and delete notes
- Folders (categories): create, filter notes by folder, and delete folders together with the notes inside them
- Share a note with another user by username; received notes appear in a read-only Shared Notes list
- Pinterest-style masonry layout for notes
- Haptic feedback on confirmation popups when running as an Android app

## Requirements
- PHP 7.4+ (PHP 8.x recommended)
- MySQL or MariaDB
- A PHP web server such as XAMPP or MAMP
- phpMyAdmin (optional, for importing the SQL file)
- Node.js (current LTS) and the Ionic CLI (`npm install -g @ionic/cli`)
- Android Studio (to build the APK)

## Install the API
1. Download or clone this repository. Copy the API folder (`ionic-notes-api`) into an `api` folder inside your PHP server's document root, so the endpoints are reachable at `http://localhost/api/ionic-notes-api/api/`.
2. Import `sql/ionic_notes.sql` through phpMyAdmin. It creates the `ionic_notes` database with the `users`, `notes`, `categories`, `shared_notes`, and `auth_tokens` tables. The tables have a 2 example users on it and 8 example notes
3. Update database credentials in `config/db.php`. XAMPP commonly uses host `localhost`, user `root`, and an empty password. MAMP commonly uses `root` as the password; use the credentials configured on your machine.
4. Start the web server and database service.
5. Open `/api/ionic-notes-api/api/notes.php?type=my-notes` in a browser. A JSON response saying `Please log in again` (status `401`) confirms the API is running.

## Run the app
1. Run `npm install` in the Ionic project folder.
2. Check the API address in `services/notes.ts` and `services/auth.ts`. By default they point to `http://localhost/api/ionic-notes-api/api/notes.php` and `.../auth.php`.
3. Make sure the interceptor is registered in `main.ts` with `provideHttpClient(withInterceptors([authInterceptor]))`. It attaches the login token to every request.
4. Run `ionic serve` and open the app in your browser.

## Endpoints
Authentication endpoints use `api/auth.php`. Everything else uses `api/notes.php`. The endpoint is chosen with the `type` query parameter.

### Authentication (`api/auth.php`, POST only)

| Method | URL | Purpose |
| --- | --- | --- |
| POST | `/api/auth.php?type=register` | Create an account and receive a token |
| POST | `/api/auth.php?type=login` | Log in and receive a token |
| POST | `/api/auth.php?type=logout` | Revoke the current token |

Register and login return `user_id`, `username`, `email`, and `token`.

### Notes API (`api/notes.php`)
Every request needs the header `Authorization: Bearer <token>`. The user is taken from the token, so no user ID is sent.

| Method | URL | Purpose |
| --- | --- | --- |
| GET | `/api/notes.php?type=my-notes` | List your notes |
| GET | `/api/notes.php?type=shared-notes` | List notes shared with you |
| GET | `/api/notes.php?type=categories` | List your folders |
| POST | `/api/notes.php?type=note` | Create a note |
| POST | `/api/notes.php?type=category` | Create a folder |
| POST | `/api/notes.php?type=share` | Share a note with another user |
| PUT | `/api/notes.php?type=note&id=1` | Update a note |
| DELETE | `/api/notes.php?type=note&id=1` | Delete a note |
| DELETE | `/api/notes.php?type=shared-note&id=1` | Delete a received (shared) note |
| DELETE | `/api/notes.php?type=category&ids=1,2,3` | Delete folders and every note inside them |

## Example request bodies
Send `Content-Type: application/json`.

Register (`POST /api/auth.php?type=register`):

```json
{
  "username": "ana",
  "email": "ana@example.com",
  "password": "secret123"
}
```

Login (`POST /api/auth.php?type=login`):

```json
{
  "email": "ana@example.com",
  "password": "secret123"
}
```

Create a note (`POST /api/notes.php?type=note`). `category_id` can be `null` for a note without a folder:

```json
{
  "category_id": null,
  "note_title": "Shopping list",
  "note_content": "Milk, eggs, bread"
}
```

Share a note (`POST /api/notes.php?type=share`):

```json
{
  "note_id": 1,
  "target_username": "ben"
}
```

## Database
- `users`: `user_id`, `username`, `email`, `password` (hashed with `password_hash`)
- `notes`: `note_id`, `user_id`, `category_id`, `note_title`, `note_content`, `created_at`
- `categories`: `category_id`, `user_id`, `category_name`
- `shared_notes`: `sharedNote_id`, `user_id` (recipient), `received_from_id`, `source_note_id`, `sharedNote_title`, `sharedNote_content`, `created_at`
- `auth_tokens`: `token_hash`, `user_id`, `created_at`, `expires_at`

Login tokens are valid for 30 days and only a hash of each token is stored.

## HTTP status codes
- `200`: successful request
- `204`: CORS preflight request accepted
- `400`: missing or invalid request input
- `401`: missing, invalid, or expired token, or wrong email/password
- `404`: note, folder, or user not found (this includes notes and folders that belong to someone else)
- `405`: method not allowed
- `409`: duplicate (username or email already used, note already shared with that user)
- `500`: server/database error

## Project structure
- `ionic-notes-api/api/`: `auth.php`, `notes.php`
- `ionic-notes-api/config/`: `db.php` (database connection), `auth_helper.php` (token helpers)
- `ionic-notes-api/sql/`: `ionic_notes.sql`
- `src/app/pages/`: `login`, `register`, `my-notes`, `shared-notes`, `category`, `note-editor`, `account-settings`
- `src/app/services/`: `auth.ts`,`haptics.ts`, `notes.ts`
- `src/app/guards/`: `auth.guard.ts` (protects pages that need a logged-in user)
- `src/app/interceptors/`: `auth.interceptor.ts` (adds the token, sends you to login on a `401`)
- `src/app/utils/`: `masonry.ts` (left-to-right masonry layout)

## CORS
The API includes a small development allow-list for common Ionic/Capacitor origins (`http://localhost:8100`, `capacitor://localhost`, `https://localhost`, and others). Add your exact frontend origin to the allow-list in both `api/notes.php` and `api/auth.php` when necessary.

## Build the Android APK
1. Set the API address in `services/notes.ts` and `services/auth.ts` to your hosted `https://` domain.
2. Set `appId` (package name) and `appName` in `capacitor.config.ts`.
3. Run `ionic build`, then `ionic cap add android` (first time only), then `ionic cap sync android`.
4. Generate the app icon with `ionic capacitor-assets generate --android` (needs the images in an `assets/` folder).
5. Add `<uses-permission android:name="android.permission.VIBRATE" />` to `android/app/src/main/AndroidManifest.xml` for haptic feedback.
6. Run `ionic cap open android`, then use Build, then Build APK(s) in Android Studio.

## Hosting notes
The hosted API must use HTTPS for the APK to work.

## Security note
This is a learning/school project. Passwords are hashed, tokens expire, and every note, folder, and share is checked against the logged-in user. It still has no login rate limiting and a proper security review. Do not use it with real personal data