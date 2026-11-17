# Coka puni 20 · Disco Girl Party 🪩

Pozivnica za rođendan. Čist HTML, CSS i JS uz Bootstrap 5 (CDN), bez build koraka, pa radi na bilo kom statičkom hostingu.

## Šta treba da ubaciš

Sve slike idu u folder `img/`, a putanje se podešavaju u `js/config.js` (deo `slike`).

| Fajl | Šta je |
|---|---|
| `img/coka.jpg` | glavna slika slavljenice, najbolje uspravna (4:5) |
| `img/ulaz.jpg` | slika na kojoj je nacrtan ulaz u zgradu |
| `img/inspo/inspo1.jpg` … | outfit inspiracija, može ih biti koliko hoćeš |

Ako slika fali, lokalno se vidi prugasti placeholder sa imenom fajla, a na javnom sajtu se ta slika samo ne prikazuje.
Za opis ispod slike popuni polje `opis` u `config.js`.

## Menjanje teksta, datuma, adrese

Sve je u `js/config.js`. Preview za WhatsApp/Viber (`og:` tagovi) je u `<head>` delu `index.html`. Tu promeni URL ako sajt prebaciš na drugi hosting.

## Lokalno pokretanje

```bash
python -m http.server 5500
```

pa otvori http://localhost:5500. Intro ekran se prikazuje jednom po tabu; za ponovni prikaz otvori novi tab.

## Objavljivanje (GitHub Pages)

Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
Sajt će biti na `https://mmileticc.github.io/coka-rodj/`.

## Sitnice

- `noindex` + `robots.txt` da ga Google ne indeksira (na sajtu je adresa stana).
- Klik na disko kuglu pali disko režim na 8 sekundi.
- Animacije se gase ako telefon ima uključeno „smanji pokrete“.
