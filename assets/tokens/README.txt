Offline-Rollenbilder (Token-PNGs)
=================================

Reihenfolge (globals.js roleImageUrlList):

  • file:// (Doppelklick index.html): icons/*.webp zuerst (zuverlässig), dann
    assets/tokens, zuletzt CDN.
  • http(s) (npm start): CDN zuerst, dann assets/tokens, dann icons.

  Nur lokale Volltokens bevorzugen: BOTC_LOCAL_TOKEN_FIRST = true

Einmalig mit Internetverbindung aus dem Projektroot:

  npm run assets:tokens

Optional bestehende Dateien überschreiben:

  npm run assets:tokens:force

Danach sollte die Leiter-App mit Service Worker und zuvor geladener Seite die PNGs aus dem Cache bzw. von der Platte nutzen.

Quelle der URLs: Feld "remoteImage" in roles/roles-master.json (json-on-the-clocktower).
