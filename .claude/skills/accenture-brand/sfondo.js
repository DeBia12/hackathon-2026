/* ============================================================================
   SFONDO ANIMATO DEL DECK
   Due sole responsabilita':
   1. sulle slide .slide-manifesto il video sale a piena intensita', come fa la
      hero del sito; sulle altre resta attenuato dietro al testo;
   2. chi ha chiesto meno animazioni riceve un fermo immagine, non un video.

   Va caricato DOPO Reveal.initialize(). Non ha dipendenze.
   ============================================================================ */
(function () {
  "use strict";

  var sfondo = document.querySelector(".acn-sfondo");
  var video = document.querySelector(".acn-sfondo__video");
  if (!sfondo || !video) return;

  var menoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Il primo fotogramma del loop e' quasi nero: fermarsi li' equivale a non
     avere sfondo. Ci spostiamo dove la nuvola di particelle e' gia' formata. */
  function fermaSuFotogramma() {
    video.pause();
    var vai = function () {
      try {
        video.currentTime = Math.min(2, video.duration || 2);
      } catch (e) {
        /* alcuni browser rifiutano il seek prima dei metadati: pazienza,
           resta il primo fotogramma. Non vale una gestione piu' pesante. */
      }
    };
    if (video.readyState >= 1) vai();
    else video.addEventListener("loadedmetadata", vai, { once: true });
  }

  function applicaMovimento() {
    if (menoMovimento.matches) fermaSuFotogramma();
    else video.play().catch(function () { /* autoplay negato: resta il nero */ });
  }

  applicaMovimento();
  menoMovimento.addEventListener("change", applicaMovimento);

  function aggiornaIntensita(slide) {
    if (!slide) return;
    sfondo.classList.toggle("acn-sfondo--pieno", slide.classList.contains("slide-manifesto"));
  }

  if (window.Reveal) {
    Reveal.on("ready", function (e) { aggiornaIntensita(e.currentSlide); });
    Reveal.on("slidechanged", function (e) { aggiornaIntensita(e.currentSlide); });
  }
})();
