(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
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
          if (next) next.value = "http://jcservice.fr/merci.html";
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
})();
