
# Import tracker

Henter ut imports i package.json for alle NAV sine repo og viser det i en liten app

https://dependency-tracker.dev.nav.no/

## Crawler

```
yarn install
yarn build
yarn start

-> localhost:3000/api/crawl
```

Crawler vil som default laste ned alle repo fra NAVIKT med depth:1 (uten historie) for så å lese gjennom alle package.json filer og lage en oppsummering.

Ved å endre litt kode kan crawler laste ned med historie og generere data for hver månede tilbake til første repo sinn commit.

## Frontend

Etter crawler er ferdig er dataen lastet opp til gcp-bucket og hentes derfra ved deploy. For lokal kjøring må crawler kjøres en gang for så å kopiere resultat fra crawler/files -> public/data

## .env

```
TOKEN= Github secret med lesetilgang til alle repo
LOCAL=true Må settes for å kunne kjøre crawler lokalt. Brukes for å stoppe crawling i publisert app
```

## Henvendelser

Spørsmål og kontakt kan rettes til Ken Aleksander Johansen `ken.aleksander.johansen@nav.no`
