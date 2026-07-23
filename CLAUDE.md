# Inti

Een persoonlijke dagstart-app voor één gebruiker. Alles zit in één bestand:
`index.html` (HTML, CSS in een `<style>`-blok, en JavaScript als `<script type="module">`).
Data staat in Firestore, inloggen gaat via Firebase Auth.

## Opbouw van index.html

Van boven naar beneden:

1. `<style>` met alle CSS. Bovenaan een `:root` met kleuren en letters, daaronder
   de blokken per onderdeel (inlogscherm, hoofdscherm, panelen, sheets), en onderaan
   de media-queries voor telefoon en tablet.
2. De HTML: het inlogscherm `#gate`, het hoofdscherm `#app` met het plein `.plaza`,
   daarna alle panelen en de losse sheets.
3. Het script, dat begint met het blok `CONFIG` en de lijsten, en daarna de logica.

### Panelen en tegels
Het plein heeft zes tegels rond de zon in het midden:

- Zon (`#sunBtn`) opent de legende van vandaag, paneel `#legend`.
- Zilverweide en Inti zijn de twee borden (paneel `#zilverweide` en `#intiboard`),
  opgebouwd door de code in `#boards`.
- Thoth (`#thoth`) om inspiratie of iets-niet-vergeten op te schrijven.
- AI (`#ai`, "Project AI") toont elke dag een les.
- Fix shit (`#fix`) toont de drie oudste geheugen-items.
- Eén tegel is nog leeg.

Verdere schermen: `#kluis` (reservekopie), `#slot` (herinnering om te back-uppen),
en de sheets `#zwSheet` (toevoegen op een bord), `#snapSheet` (snel opschrijven).

## Firestore

Alles hangt onder `users/{uid}`:

- Collectie `thoth`: Thoth-items. Velden `text`, `kind` ("inspiratie" of "geheugen"),
  `prio`, `createdAt`, `snoozeUntil`.
- Collectie `zilverweide` en collectie `intiboard`: de twee borden. Docs met
  `kind` "cat" (velden `name`, `createdAt`) of "todo" (velden `text`, `term` "kort"
  of "lang", `catId`, `createdAt`).
- Doc `meta/dag`: `lastSun`, `legendIndex`. Onthoudt of de zon vandaag al aan was.
- Doc `meta/ai`: `status`, `reden`, `herhaald`, `wijzer`. Voortgang van de lessen.
- Doc `meta/kluis`: `laatste`, `uitstel`. Wanneer er voor het laatst geback-upt is.

## De lijsten

- `LESSONS`: de tien AI-lessen die het paneel Project AI toont. Teller past zich aan.
- `LEGENDS`: de zonverhalen die de zon per dag laat zien, één verder per keer.
- `BOARDS`: config-array van de twee borden, elk met `id`, `titel` en `col`
  (de Firestore-collectie). De borden worden hieruit opgebouwd.

## Werkwijze
- Alles zit in index.html. Wijzig alleen wat nodig is, nooit het hele bestand herschrijven.
- Controleer na elke wijziging of de accolades in de CSS kloppen en of elke $("#id")
  in de code een bestaand element aanspreekt.
- Firebase-config en e-mailadres staan bovenaan in het blok CONFIG. Niet aanpassen
  tenzij daar expliciet om gevraagd wordt.

## Taal en toon
- Alles wat de gebruiker leest is Nederlands, commentaar in de code ook.
- Gebruik nooit lange gedachtestreepjes. Komma's of haakjes.

## Wat ik niet wil
- Geen bibliotheken erbij. Alleen Firebase en Google Fonts.
- Geen localStorage voor gegevens, alles gaat naar Firestore.
- De zon blijft de start van de dag, die niet wegoptimaliseren.
