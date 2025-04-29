export default function swDev() {
  if (!("serviceWorker" in navigator)) return;
  if (window.location.hostname === "localhost") return;

  navigator.serviceWorker.register("/sw.js")
    .then((registration) => {
      console.log("SW registered:", registration);
    })
    .catch((error) => {
      console.error("SW registration failed:", error);
    });
}