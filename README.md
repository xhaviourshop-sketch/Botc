# BotC Storyteller

Offline-fähige **Blood on the Clocktower**-Hilfe für Storyteller: Grimoire am Tisch, Night Order, Jinx, Fabled, Journal, Kern/Limits/Marker-Panels, lokaler Spielstand.

**Leiter-Features (Roadmap-Stand):** **Town-Panel** (öffentliche Claims, ohne Rollen), **Bluffs-Panel** + **Spy-Ansicht** (Dämon-Bluffs im Kreis), **ST-Referenztext** aus Rolle im Sitz-Popup, **Clocktracker-Entwurf** (Toolbar 📋), Tag-Buttons im Protokoll (Nomination/Hinrichtung), Rechtshinweis unten auf der Seite. PWA-Icons über **SVG** im `manifest.json` (keine PNG nötig).

## Start

```bash
npm install
npm start
```

Öffne `http://localhost:8080`. Unter `file://` (HTML direkt öffnen) gelten andere Icon-Prioritäten — siehe `.cursor/rules/botc-token-images-frozen.mdc`.

## Eigenes Projekt vs. Werwolf

- **`/` (Root):** BotC Storyteller — dieses README.
- **`/Werwolf/`:** separates Spielprojekt, nicht Teil der BotC-App.

## Diagnose (Phase I / P)

Nach **vollständigem** Seitenladen (inkl. `botc-abilities.js`) in der Browser-Konsole:

| Funktion | Zweck |
|----------|--------|
| `BOTC_runPhaseIReport()` | Projekt-Snapshot (Rollen, Jinx, Ability-Stubs, Phasen J–M). |
| `BOTC_runPhaseHSelfCheck()` | Zählt **Stubs** vs. **vollständige** Handler für alle spielbaren Rollen (ohne Fabled). `missingHandlers` soll `[]` sein. |
| `BOTC_runActiveScriptSelfCheck()` | Prüft **aktuelles Script** (TB/BMR/S&V/Custom) auf fehlende `BOTC_ABILITIES`-Keys. |
| `BOTC_runTBselfCheck()` | Nur Trouble-Brewing-Kernliste (Keys vorhanden). |
| `BOTC_DEBUG_NIGHT_ORDER = true` | Ausführliche Night-Order-`console.log` (Debugging). |

Viele Rollen nutzen **Phase-H-Stubs** (Assistent zeigt generischen Flow) — siehe Konsolenzeile „Phase P — Abilities“ im Phase-I-Report.

## Daten & Build

- Rollenquelle: `roles/roles-master.json` → eingebettet nach `globals.js` via `npm run roles:embed-globals`.
- Checks: `npm run ci` (führt `scripts/smoke-checks.js` aus: Abilities-Check + Night-Order-Audit-Metrik).

## Persistenz (Phase R)

- **`state.js`:** `localStorage` unter `botc_storyteller_state_v2`; automatische Migration von `botc_storyteller_state_v1`.
- **`idb-mirror.js`:** optionale **IndexedDB-Spiegelung** desselben JSON nach jedem Speichern (Backup, kein zweites Lade-UI).

## Cursor-Regeln

Unter `.cursor/rules/`: Phasen I–M, eingefrorene Token-Bildlogik, usw.
