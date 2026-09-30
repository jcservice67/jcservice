(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.replaceChildren();
    for (var i = 0; i < 3; i++) {
      var bar = document.createElement("span");
      bar.className = "nav-toggle-bar";
      toggle.appendChild(bar);
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
  }

  document.querySelectorAll("form[action*='formsubmit.co']").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      var status = form.querySelector(".form-status");
      if (!status) {
        status = document.createElement("p");
        status.className = "form-status";
        status.setAttribute("role", "status");
        form.appendChild(status);
      }
      status.textContent = "";
      if (btn) {
        btn.disabled = true;
        btn.dataset.label = btn.dataset.label || btn.textContent;
        btn.textContent = "Envoi…";
      }
      var endpoint = (form.getAttribute("action") || "").replace("formsubmit.co/", "formsubmit.co/ajax/");
      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) {
          return r.json().then(function (data) {
            return { ok: r.ok, data: data };
          }).catch(function () {
            return { ok: false, data: null };
          });
        })
        .then(function (res) {
          var ok = res.ok && res.data && (res.data.success === true || res.data.success === "true");
          if (!ok) throw new Error("send");
          form.dataset.sent = "1";
          window.location.assign("merci.html");
        })
        .catch(function () {
          form.dataset.sent = "1";
          var next = form.querySelector("[name=_next]");
          if (next) next.value = "https://jcservice.fr/merci.html";
          form.submit();
        })
        .finally(function () {
          if (btn && form.dataset.sent !== "1") {
            btn.disabled = false;
            btn.textContent = btn.dataset.label || "Envoyer la demande";
          }
        });
    });
  });

  var hasLocal = Array.prototype.some.call(document.querySelectorAll('script[type="application/ld+json"]'), function (el) {
    return (el.textContent || "").indexOf("HVACBusiness") !== -1;
  });
  if (!hasLocal) {
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "ld-local";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HVACBusiness",
      "@id": "https://jcservice.fr/#entreprise",
      "name": "JC Service",
      "url": "https://jcservice.fr/",
      "image": "https://jcservice.fr/logo-hero.png",
      "telephone": "+33685306973",
      "email": "contact@jcservice.fr",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "9a route de Paris",
        "addressLocality": "Ittenheim",
        "postalCode": "67117",
        "addressRegion": "Bas-Rhin",
        "addressCountry": "FR"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 48.6032315, "longitude": 7.5979676 },
      "hasMap": "https://www.google.com/maps/search/?api=1&query=48.6032315,7.5979676"
    });
    document.head.appendChild(ld);
  }
})();
