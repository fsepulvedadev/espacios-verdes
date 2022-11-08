/*
-------------------------------------------------------------------------------------------------


//   Desarrollado por Francisco Sepulveda para COPADE - 2022    \\
// Pueden contactarme en https://fsepulveda.vercel.app/ o por mail fsepulvedadev@gmail.com \\


-------------------------------------------------------------------------------------------------

*/

const absorcionTag = document.getElementById("absorcion");
const arboladoTag = document.getElementById("arbolado");
const superficieTag = document.getElementById("superficie");
import verdeData from "./capas/infra_prov_nqn_geo.geojson" assert { type: "json" };
const listaLocalidades = document.getElementById("lista-localidades");
const localidades = [
  {
    nombre: "Zapala",
    loc: [-38.9040134, -70.0799899],
    id: "zapala",
    zoom: 13,
  },
  {
    nombre: "Loncopue",
    loc: [-38.0711421, -70.6204302],
    id: "loncopue",
    zoom: 15,
  },
  {
    nombre: "Piedra del aguila",
    loc: [-40.0472301, -70.0847779],
    id: "piedra",
    zoom: 15,
  },
  {
    nombre: "Picun Leufu",
    loc: [-39.5177718, -69.2969567],
    id: "picun",
    zoom: 15,
  },
  {
    nombre: "Cutral-co",
    loc: [-38.9374343, -69.2552547],
    id: "cutralco",
    zoom: 14,
  },
  {
    nombre: "Plaza Huincul",
    loc: [-38.933991, -69.2089947],
    id: "plaza",
    zoom: 14,
  },
  { nombre: "Añelo", loc: [-38.3524438, -68.7931937], id: "anelo", zoom: 15 },
  {
    nombre: "Chos malal",
    loc: [-37.3716726, -70.2891886],
    id: "chosmalal",
    zoom: 14,
  },
  {
    nombre: "Rincon de los Sauces",
    loc: [-37.3967149, -68.9470263],
    id: "rincon",
    zoom: 14,
  },
  {
    nombre: "Plottier",
    loc: [-38.9475497, -68.2376048],
    id: "plottier",
    zoom: 15,
  },
  {
    nombre: "Centenario",
    loc: [-38.830157, -68.1741028],
    id: "centenario",
    zoom: 13,
  },
  {
    nombre: "Villa la Angostura",
    loc: [-40.7632679, -71.6504163],
    id: "villa",
    zoom: 15,
  },
  {
    nombre: "Junin de los Andes",
    loc: [-39.9466055, -71.1087068],
    id: "junin",
    zoom: 13,
  },
  {
    nombre: "San martin de los andes",
    loc: [-40.1390821, -71.3346403],
    id: "sanmartin",
    zoom: 13,
  },
  {
    nombre: "Pehuenia",
    loc: [-38.890998, -71.1938877],
    zoom: 14,
    id: "pehuenia",
  },
  {
    nombre: "Alumine",
    loc: [-39.2363186, -70.9376694],
    id: "alumine",
    zoom: 14,
  },
  {
    nombre: "Las lajas",
    loc: [-38.5302419, -70.389171],
    id: "laslajas",
    zoom: 14,
  },
  {
    nombre: "Neuquen Capital",
    loc: [-38.9410802, -68.1854411],
    id: "neuquen",
    zoom: 12,
  },
];

const handleClickLocalidades = (e) => {
  let targetId = e.target.id;
  let target = localidades.find((e) => e.id === targetId);
  cerrarSidebar();

  console.log(target);

  map.flyTo(target.loc, target.zoom);
};

const agregarLocalidadesAlista = () => {
  let listaLi = localidades.map(
    (e) =>
      `<li class='bg-green-700 text-white text-center rounded localidad cursor-pointer h-8 flex items-center justify-center font-bold hover:scale-105 duration-300 hover:shadow-lg hover:shadow-green-600' id=${e.id}>${e.nombre}</li>`
  );
  let concatenado = [];
  for (let i = 0; i < listaLi.length; i++) {
    concatenado += listaLi[i];
  }

  listaLocalidades.innerHTML = concatenado;
  let botones = document.getElementsByClassName("localidad");
  let listaBotones = [].slice.call(botones);
  listaBotones.forEach((e) => {
    e.addEventListener("click", handleClickLocalidades);
  });
};

agregarLocalidadesAlista();

const map = L.map("map", {
  center: [-38.9410802, -68.1854411],
  zoom: "12",
});

let capaSelecionada = "abs";

const negro =
  "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/argenmap_oscuro@EPSG:3857@png/{z}/{x}/{-y}.png";
const gris =
  "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG:3857@png/{z}/{x}/{-y}.png";

const argenmap = L.tileLayer(gris, {
  attribution:
    '&copy; <a href="https://ign-argentina.github.io/argenmap-web/">Argenmap</a> ',
}).addTo(map);
const colors = {
  selecionado: [
    "#d0d1e6",
    "#a6bddb",
    "#74a9cf",
    "#3690c0",
    "#0570b0",
    "#034e7b",
  ],
  arbolado: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
  absorcion: ["#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
  superficie: [
    "#ffffd4",
    "#fee391",
    "#fec44f",
    "#fe9929",
    "#d95f0e",
    "#993404",
  ],
};
const agregarIndice = (tipo) => {
  let otrosIndices = document.querySelectorAll(
    "div.info.legend.leaflet-control"
  );
  if (otrosIndices.length === 0) {
    const leyenda = L.control({ position: "bottomright" });
    let grados;
    if (tipo === "sup") {
      grados = [0, 1000, 8000, 30000];
      leyenda.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend"),
          grades = grados,
          labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1, "sup") +
            ";" +
            'margin-right: 5px;"></i> ' +
            grades[i] +
            (grades[i + 1]
              ? " - " + grades[i + 1] + " m" + "<sup>2</sup>"
              : "+" + " m" + "<sup>2</sup>") +
            "<br>";
        }

        return div;
      };
      leyenda.addTo(map);
    } else if (tipo === "arb") {
      grados = [1, 2, 3, 4];
      leyenda.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend"),
          grades = grados,
          labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1, "arb") +
            ";" +
            'margin-right: 5px;"></i> ' +
            calcularPorcentajes(grades[i]) +
            "<br>";
        }

        return div;
      };
      leyenda.addTo(map);
    } else {
      grados = [1, 2, 3, 4];
      leyenda.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend"),
          grades = grados,
          labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1, "abs") +
            ";" +
            'margin-right: 5px;"></i> ' +
            calcularPorcentajes(grades[i]) +
            "<br>";
        }

        return div;
      };
      leyenda.addTo(map);
    }
  } else {
    otrosIndices.forEach((e) => e.remove());
    agregarIndice(tipo);
  }
};
const cerrarSidebar = () => {
  let targetSidebar = document.getElementById("sidebar");
  let tabTarget = document.querySelector("li.active");
  console.log(tabTarget);
  tabTarget.classList.remove("active");
  targetSidebar.classList.add("collapsed");
};

const cambiarCapa = (e) => {
  let target = e.target;
  cerrarSidebar();

  let abs = document.querySelectorAll("#absorcion");
  let arb = document.querySelectorAll("#arbolado");
  let sup = document.querySelectorAll("#superficie");

  abs.forEach((e) => {
    e.classList.remove("ring-2");
  });
  arb.forEach((e) => {
    e.classList.remove("ring-2");
  });
  sup.forEach((e) => {
    e.classList.remove("ring-2");
  });

  switch (target.id) {
    case "arbolado":
      let targetEle = document.querySelector(
        "div#arbolado.w-full.cursor-pointer.p-1.rounded.ring-green-600"
      );
      targetEle.classList.add("ring-2");
      break;
    case "absorcion":
      let targetEle2 = document.querySelector(
        "div#absorcion.w-full.cursor-pointer.p-1.rounded.ring-blue-400"
      );
      targetEle2.classList.add("ring-2");
      break;
    case "superficie":
      let targetEle3 = document.querySelector(
        "div#superficie.w-full.cursor-pointer.p-1.rounded.ring-orange-400"
      );
      targetEle3.classList.add("ring-2");
      break;

    default:
      break;
  }

  geojson.remove();
  leyenda.remove();
  switch (target.id) {
    case "absorcion":
      capaSelecionada = "abs";
      agregarIndice("abs");
      colors.selecionado = colors.absorcion;
      geojson = L.geoJSON(verdeData, {
        style: style,
        onEachFeature: onEachFeature,
      });
      geojson.addTo(map);

      break;

    case "arbolado":
      capaSelecionada = "arb";
      agregarIndice("arb");

      colors.selecionado = colors.arbolado;
      geojson = L.geoJSON(verdeData, {
        style: style,
        onEachFeature: onEachFeature,
      });
      geojson.addTo(map);

      break;

    case "superficie":
      capaSelecionada = "sup";
      agregarIndice("sup");

      colors.selecionado = colors.superficie;

      geojson = L.geoJSON(verdeData, {
        style: style,
        onEachFeature: onEachFeature,
      });
      geojson.addTo(map);

      break;

    default:
      break;
  }
};

function getColor(d, tipo) {
  switch (tipo) {
    case "sup":
      colors.selecionado = colors.superficie;

      return d > 30000
        ? `${colors.selecionado[3]}`
        : d > 8000
        ? `${colors.selecionado[2]}`
        : d > 1000
        ? `${colors.selecionado[1]}`
        : `${colors.selecionado[0]}`;
      break;
    case "arb":
      colors.selecionado = colors.arbolado;

      return d > 5
        ? `${colors.selecionado[5]}`
        : d > 4
        ? `${colors.selecionado[4]}`
        : d > 3
        ? `${colors.selecionado[3]}`
        : d > 2
        ? `${colors.selecionado[2]}`
        : d > 1
        ? `${colors.selecionado[1]}`
        : `${colors.selecionado[0]}`;
      break;
    case "abs":
      colors.selecionado = colors.absorcion;

      return d > 5
        ? `${colors.selecionado[5]}`
        : d > 4
        ? `${colors.selecionado[4]}`
        : d > 3
        ? `${colors.selecionado[3]}`
        : d > 2
        ? `${colors.selecionado[2]}`
        : d > 1
        ? `${colors.selecionado[1]}`
        : `${colors.selecionado[0]}`;
      break;

    default:
      break;
  }
}

absorcionTag.addEventListener("click", cambiarCapa);
arboladoTag.addEventListener("click", cambiarCapa);
superficieTag.addEventListener("click", cambiarCapa);

function highlightFeature(e) {
  var layer = e.target;

  info.update(layer.feature.properties);

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  layer.bringToFront();
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

function style(features) {
  if (capaSelecionada === "sup")
    return {
      weight: 2,
      opacity: 1,
      color: getColor(features.properties.supm2, "sup"),
      dashArray: "3",
      fillOpacity: 1,
    };
  else if (capaSelecionada === "abs")
    return {
      weight: 2,
      opacity: 1,
      color: getColor(features.properties.suel_absor, "abs"),
      dashArray: "3",
      fillOpacity: 1,
    };
  else
    return {
      weight: 2,
      opacity: 1,
      color: getColor(features.properties.arbolado, "arb"),
      dashArray: "3",
      fillOpacity: 1,
    };
}

function zoomToFeature(e) {
  console.log(e);
  map.fitBounds(e.target.getBounds());
}

function calcularPorcentajes(valor) {
  switch (+valor) {
    case 1:
      return "0 a 25%";
      break;
    case 2:
      return "25 a 50%";
      break;
    case 3:
      return "50 a 75%";
      break;
    case 4:
      return "75 a 100%";
      break;
  }
}

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    `<h4>${props ? props.tipo : "Datos de la capa"}</h4>` +
    (props
      ? `<i class="fa-solid fa-droplet"></i></i> Absorcion: <br/> ${calcularPorcentajes(
          props.suel_absor
        )} en relacion a m<sup>2</sup>` +
        "<br />" +
        `<i class="fa-solid fa-tree"></i> Arbolado: <br/> ${calcularPorcentajes(
          props.arbolado
        )} en relacion a m<sup>2</sup>` +
        "<br />" +
        `<i class="fa-solid fa-ruler-combined"></i> Superficie: <br/> ${props.supm2.toFixed(
          2
        )} m<sup>2</sup>`
      : "Seleccione una capa");
};

info.addTo(map);

// INDICE DE RANGOS
var leyenda = L.control({ position: "bottomright" });

leyenda.onAdd = function (map) {
  let grados;
  if (capaSelecionada === "sup") {
    grados = [500, 5000, 25000, 45000];
  } else {
    grados = [1, 2, 3, 4];
  }

  var div = L.DomUtil.create("div", "info legend"),
    grades = grados,
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1, "abs") +
      ";" +
      'margin-right: 5px;"></i> ' +
      calcularPorcentajes(grades[i]) +
      "<br>";
  }

  return div;
};

leyenda.addTo(map);

var sidebar = L.control.sidebar("sidebar").addTo(map);

let geojson = L.geoJSON(verdeData, {
  style: style,
  onEachFeature: onEachFeature,
});

geojson.addTo(map);

/* 
const circle = L.circleMarker([-38.941, -67.115], {
  dashArray: "15,45",
  dashSpeed: -60,

  radius: radius,
  interactive: false,
}).addTo(map); */