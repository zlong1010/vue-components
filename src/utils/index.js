export function isMobile() {
  const ua = navigator.userAgent;
  const Android = !!ua.match(/Android/i);
  const iOS = !!ua.match(/iPhone|iPad|iPod/i);
  return Android || iOS;
}

window.isMobile = isMobile();
