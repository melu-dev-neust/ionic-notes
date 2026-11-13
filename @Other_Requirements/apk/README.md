# Note IT: Android APK (Local Storage Version)

This folder contains the installable Android app (`.apk`) of NoteIT, so you can try the whole app on your phone without setting anything up.

## Why this version uses local storage
The full version of Note IT needs a PHP API and a MySQL database running on a server. Deploying those online requires a paid hosting service, which is outside this project's budget, and running them locally would mean setting up Apache, a database, and the API files on your own computer.

To avoid all of that, this APK stores everything on the phone itself, in the app's local storage. There is no server and no internet connection is needed. Install it and it works.

The purpose of this APK is to let you experience the whole app.

You can still use the original online version of the app by building the APK from the main project folder.

## What works
All app functions are available:
- Register, log in, and log out
- Create, edit, move, and delete notes
- Create folders, filter notes by folder, and delete folders (the notes inside a deleted folder are deleted too)
- Share a note with another user by username
- Masonry layout and haptic feedback on confirmation popups

## What is different from the full version
- **Other users' accounts can't be found.** Since there is no server, the app can only see accounts created on the same phone. To try sharing, register a second account on the same phone, share a note to its username, then log in as that account to see it under Shared Notes.
- **Your data stays on your phone.** Nothing is synced between devices. A note created on one phone will not appear on another.
- **Uninstalling the app or clearing its storage deletes everything**, including accounts and notes.

## Install
1. Copy the `.apk` file to your Android phone.
2. Open the file. If Android asks, allow **Install unknown apps** for the app you opened it from (for example your file manager or browser).
3. Tap **Install**, then open **Note IT**.

If the installation fails because an older version of the app is already on the phone, uninstall the old version first and install again.

## Getting started
1. On the login screen, tap **Register** and create an account (username, email, and a password of at least 6 characters).
2. You are logged in automatically. Tap the **+** button to add your first note.
3. Use the folder button at the top of My Notes to create folders.
4. Tap the account icon at the top right to view your account or log out.

Accounts are created on your phone, so you will need to register before you can log in.

## Privacy
Passwords are salted and hashed before they are stored, and nothing leaves your phone.

## Full version
The full version of Note IT, which uses a PHP REST API and a MySQL database, is in the main project folder. See its README for setup instructions.
