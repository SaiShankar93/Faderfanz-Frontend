export default function LoadSirv(components) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://scripts.sirv.com/sirvjs/v3/sirv.js";
    script.type = "text/javascript";
    script.async = true;
    if (components) {
      script.dataset.components = components;
    }
    script.onload = resolve;
    document.body.appendChild(script);
  });
}
