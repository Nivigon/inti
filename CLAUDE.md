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
- Thoth (`#thoth`) is de ideeenbank, alleen inspiratie opschrijven en teruglezen.
  Ideeen kunnen los blijven of onder een project hangen (bijvoorbeeld een spel).
  Bij Bewaard staat per groep een kopje met de punten eronder, in- en uitklapbaar,
  met een regel om er meteen een punt bij te zetten. De tegel heeft een eigen
  snelknop (`#thothSnapBtn`, turkoois) om zonder het paneel te openen een idee te
  bewaren, met de projectkeuze erbij. To do's leg je vast met de snelknop
  (`#snapBtn`, op de tegel Fix shit), die komen bij Fix shit.
- AI (`#ai`, "Project AI") toont elke dag een les.
- Fix shit (`#fix`) toont de drie oudste geheugen-items. Iets wat structureel terugkomt
  (`herhaal` gevuld) en pas later weer aan de beurt is blijft eruit: het telt niet
  mee en staat in het lijstje Komt terug (`#fixWacht`, in- en uitklapbaar), tot zijn
  dag er weer is. Losse to do's met een datum blijven gewoon op de lijst staan. Gedaan gooit niets weg:
  het item krijgt `gedaan` en zakt naar het lijstje Net gedaan onderaan het paneel
  (`#fixGedaan`, in- en uitklapbaar), waar het met Terug weer op de lijst komt. De
  toast na Gedaan of Even opzij heeft een knopje Toch niet om een misklik meteen
  terug te draaien. Na `BEWAAR_GEDAAN` dagen wordt een afgevinkt item echt gewist.
- AMHC (`#amhc`) is de werklijst: to do's met een persoon en tijdsdruk, te bekijken
  op urgentie, per persoon of gebundeld per onderwerp (op trefwoorden, met de
  woordenlogica van de feedback). De tegel heeft een eigen snelknop (`#amhcSnapBtn`).

Verdere schermen: `#kluis` (reservekopie), `#slot` (herinnering om te back-uppen),
en de sheets `#zwSheet` (toevoegen op een bord), `#snapSheet` (snel een to do
opschrijven, met optionele deadline), `#editSheet` (een Fix shit-taak aanpassen),
`#amhcSheet` (een AMHC-taak toevoegen of aanpassen), `#thothSheet` (snel een idee
opschrijven) en `#projSheet` (een project in Thoth maken of hernoemen; staat in de
HTML na `#thothSheet`, zodat het daar netjes overheen komt).

## Firestore

Alles hangt onder `users/{uid}`:

- Collectie `thoth`: Thoth-items. Velden `text`, `kind` ("inspiratie", "geheugen"
  of "project"), `prio`, `createdAt`, `snoozeUntil`, `opzij` (hoe vaak een
  geheugen-item bij Fix shit opzij is gezet), `deadline` (optionele datum
  "JJJJ-MM-DD" van een geheugen-item), `tijd` (optioneel tijdstip "UU:MM" bij de
  deadline; "te laat" wordt tijd-bewust), `gedaan` (null of het tijdstip waarop je
  het afvinkte; zo'n item telt niet meer mee en staat bij Net gedaan) en `herhaal` (null of "dag"/"week"/"maand"
  voor een terugkerende to do; de deadline schuift bij Gedaan door naar de volgende
  keer). Inspiratie komt binnen via Thoth, geheugen-items (de to do's) via de
  snelknop. Een doc met kind "project" is een kopje in Thoth (velden `name` en
  `createdAt`); een inspiratie-item wijst er met `projectId` naar, of is null en
  staat dan onder Los. Gaat een project weg, dan worden de punten erin weer los.
- Collectie `zilverweide` en collectie `intiboard`: de twee borden. Docs met
  `kind` "cat" (velden `name`, `createdAt`) of "todo" (velden `text`, `term` "kort"
  of "lang", `catId`, `createdAt`).
- Collectie `amhc`: de werklijst. Velden `text`, `wie` (naam of null), `urg`
  ("vandaag", "week" of "later") en `createdAt`. De bundels per onderwerp worden
  niet opgeslagen maar bij elk tonen opnieuw uit de teksten berekend.
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
