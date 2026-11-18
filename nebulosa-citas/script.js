var CONFIG = {
  name: "Tu Negocio",
  initials: "TN",
  theme: "light",
  headline: "Reserva tu cita en menos de un minuto",
  text: "Elige el servicio, el día y la hora que mejor te queden. Sin llamadas ni esperas.",
  services: [
    ["💈", "Corte clásico", "Corte con acabado profesional", 30, 250],
    ["🧔", "Corte y barba", "Perfilado y cuidado completo", 45, 380],
    ["✨", "Servicio premium", "Experiencia completa con más detalle", 60, 550],
    ["🎁", "Combo especial", "Dos servicios con descuento", 75, 700],
  ],
  open: 9,
  close: 17,
  step: 30,
  closedDays: [0],
  daysAhead: 12,
  address: "📍 Managua, Nicaragua · Lun a Sáb, 9:00 a. m. a 5:00 p. m.",
  currency: "C$",
  whatsapp: "50557344053",
  brand: "#0ea5a4",
  brand2: "#6366f1",
  demoBar:
    "Plantilla Nebulosa · Reserva de citas · Demo creada por Quark Studio · Servicios y horarios de ejemplo",
};
/* ===== Fin de la configuración ===== */
var $ = function (i) {
    return document.getElementById(i);
  },
  C = CONFIG,
  S = { svc: null, date: null, time: null },
  A = [],
  ST = ["Confirmada", "Atendida", "No asistió", "Cancelada"];
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c];
  });
}
function money(n) {
  return C.currency + " " + n.toLocaleString("en-US");
}
var R = document.documentElement;
R.style.setProperty("--brand", C.brand);
R.style.setProperty("--brand2", C.brand2);
R.setAttribute("data-theme", C.theme || "light");
$("bar").textContent = C.demoBar;
if (!C.demoBar) $("bar").style.display = "none";
document.title = C.name + " · Reserva tu cita";
$("logo").innerHTML = "<i>" + esc(C.initials) + "</i>" + esc(C.name);
$("h1").textContent = C.headline;
$("hp").textContent = C.text;
$("addr").textContent = C.address;
$("ft").innerHTML =
  "<span>© 2026 " +
  esc(C.name) +
  "</span><span>Sistema de citas hecho con Quark Studio</span>";
function key(d) {
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
function label(d) {
  return d.toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
function hm(m) {
  var h = Math.floor(m / 60),
    mi = m % 60,
    ap = h >= 12 ? "p. m." : "a. m.";
  h = h % 12 || 12;
  return h + ":" + (mi < 10 ? "0" : "") + mi + " " + ap;
}
function days() {
  var o = [],
    d = new Date();
  d.setHours(0, 0, 0, 0);
  for (var i = 0; i < C.daysAhead; i++) {
    var x = new Date(d);
    x.setDate(d.getDate() + i);
    o.push(x);
  }
  return o;
}
function taken(d, m) {
  if (
    A.some(function (a) {
      return a.k === key(d) && a.m === m && a.st !== "Cancelada";
    })
  )
    return true;
  var h = (d.getDate() * 31 + d.getMonth() * 7 + (m / 30) * 13) % 11;
  return h < 3;
}
function slotsFor(d) {
  var o = [],
    now = new Date();
  for (var m = C.open * 60; m < C.close * 60; m += C.step) {
    var past =
      key(d) === key(now) && m <= now.getHours() * 60 + now.getMinutes();
    if (!past) o.push(m);
  }
  return o;
}
function renderSvc() {
  $("svc").innerHTML = C.services
    .map(function (s, i) {
      return (
        '<button class="sv' +
        (S.svc === i ? " on" : "") +
        '" data-i="' +
        i +
        '"><i>' +
        s[0] +
        "</i><span><b>" +
        esc(s[1]) +
        "</b><small>" +
        esc(s[2]) +
        " · " +
        s[3] +
        " min</small></span><em>" +
        money(s[4]) +
        "</em></button>"
      );
    })
    .join("");
}
function renderDays() {
  $("days").innerHTML = days()
    .map(function (d, i) {
      var c = C.closedDays.indexOf(d.getDay()) > -1;
      return (
        '<button class="d' +
        (S.date && key(S.date) === key(d) ? " on" : "") +
        '" data-i="' +
        i +
        '"' +
        (c ? " disabled" : "") +
        "><small>" +
        d.toLocaleDateString("es", { weekday: "short" }) +
        "</small><b>" +
        d.getDate() +
        "</b><small>" +
        d.toLocaleDateString("es", { month: "short" }) +
        "</small></button>"
      );
    })
    .join("");
}
function renderSlots() {
  if (!S.date) {
    $("slots").innerHTML = "";
    $("sh").style.display = "";
    return;
  }
  $("sh").style.display = "none";
  var l = slotsFor(S.date);
  $("slots").innerHTML = l.length
    ? l
        .map(function (m) {
          return (
            '<button class="t' +
            (S.time === m ? " on" : "") +
            '" data-m="' +
            m +
            '"' +
            (taken(S.date, m) ? " disabled" : "") +
            ">" +
            hm(m) +
            "</button>"
          );
        })
        .join("")
    : '<p class="hint">Ya no hay horarios disponibles hoy. Elige otro día.</p>';
}
function renderSum() {
  var s = S.svc != null ? C.services[S.svc] : null;
  $("r1").textContent = s ? s[1] : "—";
  $("r2").textContent = S.date ? label(S.date) : "—";
  $("r3").textContent = S.time != null ? hm(S.time) : "—";
  $("r4").textContent = s ? money(s[4]) : "—";
  ["s1", "s2", "s3"].forEach(function (id, i) {
    $(id).classList.toggle(
      "done",
      [S.svc != null, !!S.date, S.time != null][i],
    );
  });
  $("go").disabled = !(s && S.date && S.time != null);
}
function all() {
  renderSvc();
  renderDays();
  renderSlots();
  renderSum();
}
$("svc").onclick = function (e) {
  var b = e.target.closest(".sv");
  if (b) {
    S.svc = +b.dataset.i;
    all();
  }
};
$("days").onclick = function (e) {
  var b = e.target.closest(".d");
  if (b && !b.disabled) {
    S.date = days()[b.dataset.i];
    S.time = null;
    all();
  }
};
$("slots").onclick = function (e) {
  var b = e.target.closest(".t");
  if (b && !b.disabled) {
    S.time = +b.dataset.m;
    renderSlots();
    renderSum();
  }
};
function wa(t) {
  return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(t);
}
var last = "";
$("go").onclick = function () {
  if (!$("f").reportValidity()) return;
  var s = C.services[S.svc],
    n = $("fn").value.trim(),
    p = $("fp").value.trim();
  A.push({
    k: key(S.date),
    d: S.date,
    m: S.time,
    svc: s[1],
    price: s[4],
    name: n,
    phone: p,
    st: "Confirmada",
  });
  last =
    "Hola " +
    C.name +
    " 👋 Quiero confirmar esta cita:\n• Servicio: " +
    s[1] +
    "\n• Día: " +
    label(S.date) +
    "\n• Hora: " +
    hm(S.time) +
    "\n• Nombre: " +
    n +
    "\n• Teléfono: " +
    p +
    ($("fm").value ? "\n• Nota: " + $("fm").value : "");
  $("okp").textContent = s[1] + " · " + label(S.date) + " · " + hm(S.time);
  $("ok").classList.add("on");
  S = { svc: null, date: null, time: null };
  $("f").reset();
  all();
  renderAgenda();
};
$("okb").onclick = function () {
  window.open(wa(last), "_blank", "noopener");
};
$("okx").onclick = function () {
  $("ok").classList.remove("on");
};
addEventListener("keydown", function (e) {
  if (e.key === "Escape") $("ok").classList.remove("on");
});
function renderAgenda() {
  var live = A.filter(function (a) {
    return a.st !== "Cancelada";
  });
  $("k1").textContent = A.length;
  $("k2").textContent = A.filter(function (a) {
    return a.st === "Confirmada";
  }).length;
  $("k3").textContent = money(
    A.filter(function (a) {
      return a.st === "Confirmada" || a.st === "Atendida";
    }).reduce(function (t, a) {
      return t + a.price;
    }, 0),
  );
  if (!A.length) {
    $("list").innerHTML =
      '<p class="empty">Aún no hay citas. Agenda una desde la página de reservas y aparecerá aquí.</p>';
    return;
  }
  var g = {};
  A.slice()
    .sort(function (a, b) {
      return a.d - b.d || a.m - b.m;
    })
    .forEach(function (a) {
      (g[a.k] = g[a.k] || []).push(a);
    });
  $("list").innerHTML = Object.keys(g)
    .map(function (k) {
      var rows = g[k];
      return (
        '<div class="ag"><b style="text-transform:capitalize">' +
        label(rows[0].d) +
        "</b>" +
        rows
          .map(function (a) {
            var i = A.indexOf(a);
            return (
              '<div class="ar"><time>' +
              hm(a.m) +
              "</time><div><b>" +
              esc(a.name) +
              "</b><small>" +
              esc(a.svc) +
              " · " +
              esc(a.phone) +
              '</small></div><select data-i="' +
              i +
              '" aria-label="Estado de la cita">' +
              ST.map(function (s) {
                return (
                  "<option" +
                  (s === a.st ? " selected" : "") +
                  ">" +
                  s +
                  "</option>"
                );
              }).join("") +
              "</select></div>"
            );
          })
          .join("") +
        "</div>"
      );
    })
    .join("");
}
$("list").onchange = function (e) {
  var i = e.target.dataset.i;
  if (i != null) {
    A[i].st = e.target.value;
    renderAgenda();
    renderSlots();
  }
};
function route() {
  var p = location.hash === "#agenda";
  $("book").style.display = p ? "none" : "";
  $("agenda").style.display = p ? "block" : "none";
  if (p) {
    renderAgenda();
    scrollTo(0, 0);
  }
}
addEventListener("hashchange", route);
all();
renderAgenda();
route();
