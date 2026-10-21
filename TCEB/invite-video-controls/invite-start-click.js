<script>
/* Hand cursor on the video start button: Chrome / Edge on a computer can start Vimeo with sound from a click on this
   page, so there the button is a real button (on press, so the cookie banner can't swallow the first click). Elsewhere
   (Safari, Firefox, phones) the click must land on Vimeo's own player, so the button stays a picture. */
(function () {
  if (!(navigator.userAgentData && matchMedia('(hover:hover) and (pointer:fine)').matches)) return;
  document.documentElement.classList.add('ei-vc-click');
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.ei-vc-start'), f = b && document.querySelector('[data-vimeo]');
    if (f && window.Vimeo) new Vimeo.Player(f).play().catch(function () {});
  });
})();
</script>
