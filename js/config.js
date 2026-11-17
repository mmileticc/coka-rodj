/*
 * ============================================================
 *  KONFIGURACIJA POZIVNICE
 *  Sve što se menja (tekst, datum, adresa, slike) je ovde.
 *  Ne moraš da diraš index.html ni main.js.
 * ============================================================
 */
window.INVITE = {
  /* ---------- Režim pregleda ----------
   * true  = slike koje fale prikazuju se kao prugasti placeholder i na javnom sajtu
   *         (zgodno dok se sajt pravi i pregleda sa telefona)
   * false = slike koje fale se ne prikazuju (OVO STAVI PRE SLANJA LINKA GOSTIMA)
   */
  prikaziPlaceholdere: true,

  /* ---------- Osnovno ---------- */
  ime: "Coka",
  godine: 20,
  tema: "Disco Party",

  // Datum i vreme žurke (beogradsko vreme, +01:00 je zimsko računanje vremena)
  datum: "2026-11-26T20:00:00+01:00",
  // Kako datum piše na sajtu
  datumTekst: "Četvrtak, 26. novembar",
  vremeTekst: "od 20:00",

  /* ---------- Intro ekran (pre klika) ---------- */
  intro: {
    naslov: "Psst… imaš poziv",
    podnaslov: "Neko puni 20 i to mora da se proslavi kako dolikuje.",
    dugme: "Otvori pozivnicu",
  },

  /* ---------- Poruka (svaki string je jedan pasus) ---------- */
  poruka: {
    naslov: "Dvadesete gazim…",
    pasusi: [
      "Nije mi bilo teško naći razlog da zajedno pijemo.",
      "✨ …iii zato dobro mi je sasvim 🪩",
      "Dođite zagrejani i spremni da u četvrtak uveče zajedno komšijama objašnjavamo nastalu situaciju. 😂🥂",
      "Jedino pravilo večeri: što više sijajte da bi vam odobrili ulaz! 💃🕺",
    ],
    potpis: "Vaša Coka 💖",
  },

  /* ---------- Countdown ---------- */
  countdown: {
    naslov: "Do žurke je ostalo",
    poceloTekst: "Žurka je počela! Vidimo se na podijumu 🪩",
  },

  /* ---------- Dress code ---------- */
  dressCode: {
    naslov: "Disco Party",
    opis: "Šljokice, cirkoni, metalik, srebro i crna. Ili nešto ludo, iznenadite me!",
    // "Čipovi" koji se prikazuju ispod opisa
    tagovi: ["šljokice", "cirkoni", "metalik", "srebro", "crna", "zabavno (iznenadite me)"],
  },

  /* ---------- Lokacija ---------- */
  lokacija: {
    adresa: "Kružna 2A",
    deoGrada: "Voždovac, Beograd",
    // Uputstva za ulazak (svaka stavka je jedan red)
    uputstva: [
      "Donji ulaz zgrade",
      "Na interfonu pozvoni 13",
      "3. sprat, stan 13",
    ],
    // Tekst za pretragu na Google mapama
    mapaUpit: "Kružna 2A, Voždovac, Beograd",
  },

  /* ---------- Slike ----------
   * Ubaci fajl u odgovarajući folder i upiši putanju ovde.
   * Ako slika ne postoji, na javnom sajtu se jednostavno ne prikazuje
   * (a lokalno vidiš placeholder sa imenom fajla koji fali).
   */
  slike: {
    // Glavna slika slavljenice (pored poruke)
    slavljenica: "img/coka.jpeg",

    // Slike za lakše pronalaženje zgrade
    ulaz: [
      { src: "img/ulaz.jpg", opis: "Ovde je ulaz u zgradu" },
    ],

    // Outfit inspiracija (dodaj ili obriši koliko hoćeš)
    inspo: [
      { src: "img/inspo/inspo1.jpeg", opis: "" },
      { src: "img/inspo/inspo2.jpeg", opis: "" },
      { src: "img/inspo/inspo3.jpeg", opis: "" },
      { src: "img/inspo/inspo4.jpeg", opis: "" },
    ],
  },

  /* ---------- Kraj stranice ---------- */
  futer: "Vidimo se na podijumu",
};
