var numbmissed = document.getElementById("numbermissed");
var suma = {
  dem: 0,
  rep: 0,
  ind: 0,
  porcentrep: 0,
  porcentdem: 0,
  porcentind: 0,
  missed: 0,
  porcentmissed: 0
};
(function() {
  var lastclear = localStorage.getItem("lastclear"),
    time_now = new Date().getTime();

  if (time_now - lastclear > 1000 * 24 * 60 * 60) {
    localStorage.clear();

    localStorage.setItem("lastclear", time_now);
  }
})();
var patch = window.location.pathname;
var page = patch.split("/").pop();

if (page == "houseparty.html") {
  url = "https://api.propublica.org/congress/v1/113/house/members.json";
  var pageType = "house";
}
if (page == "senateparty.html") {
  url = "https://api.propublica.org/congress/v1/113/senate/members.json";
  var pageType = "senate";
}
if (pageType == "house" && localStorage.getItem("houseLocal")) {
  var nuevo = localStorage.getItem("houseLocal");
  var members = JSON.parse(nuevo);

  document.getElementById("loading").style.display = "none";
  start();
} else if (pageType == "senate" && localStorage.getItem("senateLocal")) {
  // localStorage.getItem("senateLocal");
  var nuevo = localStorage.getItem("senateLocal");
  var members = JSON.parse(nuevo);

  document.getElementById("loading").style.display = "none";

  start();
} else {
  var members;
  // ponemos primero url y key api
  fetch(url, {
    method: "GET",
    headers: {
      "X-API-Key": "wmtRdf4EPzlY3NBYNlbcUHa7eolGmR8j7SdwN7wA"
    }
  })
    // nombro data a la funcion que me devoverá el objeto json. cuando lo encuentre me return 'data'
    .then(function(data) {
      return data.json();
    })
    // cuando se ejecuta el primer then y me ha localizado el objeto , procedo con el segundo then y pido la información
    // de dentro del objeto json, o sea el cuerpo y nombro a esta función table, la variable predefinida arriba memberes
    // la convierto en table.results[0].members, para que en esa variable se me guarden los datos del json
    .then(function(table) {
      console.log(table);
      members = table.results[0].members;

      localStorage.setItem("members", JSON.stringify(members));

      console.log(localStorage);
      // llamo a mis funciones para que se me ejecuten

      start();
      if (pageType == "house")
        localStorage.setItem("houseLocal", JSON.stringify(members));
      if (pageType == "senate")
        localStorage.setItem("senateLocal", JSON.stringify(members));
    })
    // hago el catch después de verificar que no hay ningun error
    .catch(function(error) {
      console.log("Request failed:" + error.message);
    });
}
function start() {
  if (page == "houseparty.html" || page == "senateparty.html") {
    party(members);
    put(members);
    leastEngaged(members);
    mostEngaged(members);
  }
}

// const members = data.results[0].members;
// var tbody = document.getElementById("thestatisticsobject");

// creamos un objeto
// función para contar cuantos hay de cada partido, si se cumple el for, creamos una var
// llamada 'senate' que contiene lo de 'members', si dentro de senate.party (accedemos al objeto del js)
// al objeto suma.rep le sumamos una posición en cada vuelta, hasta que acceda a todos los
// partidos de toda la lista de members.

function party(members) {
  for (var i = 0; i < members.length; i++) {
    var senate = members[i];

    if (senate.party == "R" && senate.votes_with_party_pct != null) {
      suma.rep++;
      suma.porcentrep += senate.votes_with_party_pct;
    } else if (senate.party == "D" && senate.votes_with_party_pct != null) {
      suma.dem++;
      suma.porcentdem += senate.votes_with_party_pct;
    } else {
      suma.ind++;
      suma.porcentind += senate.votes_with_party_pct;
    }
  }
}

// party(members);

// esta función es para insertar dentro del 'id' las nuevas
// celdas td con la informacion de cada partido.
// con insertCell agregamos un elemento td automaticamente

function put(put) {
  var total = suma.rep + suma.ind + suma.dem;
  var sumas1 = suma.porcentrep + suma.porcentind + suma.porcentdem;
  var repub = document.getElementById("repub");

  repub.insertCell().innerHTML = suma.rep;
  repub.insertCell().innerHTML = (suma.porcentrep / suma.rep).toFixed(2) + "%";

  var ind = document.getElementById("ind");
  var NaN = suma.porcentind / suma.ind;
  ind.insertCell().innerHTML = suma.ind;
  //  NaN = 0;
  if (suma.porcentind == 0 || suma.ind == 0) {
    NaN = 0;
  }
  ind.insertCell().innerHTML = NaN.toFixed(2) + "%";

  var demo = document.getElementById("demo");
  demo.insertCell().innerHTML = suma.dem;
  demo.insertCell().innerHTML = (suma.porcentdem / suma.dem).toFixed(2) + "%";

  var tot = document.getElementById("tot");
  tot.insertCell().innerHTML = suma.rep + suma.ind + suma.dem;
  tot.insertCell().innerHTML = (sumas1 / total).toFixed(2) + "%";
}

// put(members);

function leastEngaged(least) {
  least.sort(function(a, b) {
    return a.votes_with_party_pct - b.votes_with_party_pct;
  });
  var tenpercent = Math.round(members.length * 0.1);
  var tbody = document.getElementById("thestatisticsobject1");
  //for()
  for (var j = 0; j < tenpercent; j++) {
    var senate = least[j];

    var tr = document.createElement("tr");
    var link = document.createElement("a");

    var nameCell = document.createElement("td");
    var missedCell = document.createElement("td");
    var pctCell = document.createElement("td");

    link.setAttribute("href", senate.url);

    if (senate.middle_name == null) {
      senate.first_name = senate.first_name + " " + senate.last_name;
    } else {
      senate.first_name =
        senate.first_name + " " + senate.middle_name + " " + senate.last_name;
    }

    link.innerHTML = senate.first_name;
    nameCell.appendChild(link);

    missedCell.innerHTML = senate.total_votes;
    pctCell.innerHTML = senate.votes_with_party_pct + "%";

    tr.append(nameCell, missedCell, pctCell);
    tbody.appendChild(tr);
  }
}

// leastEngaged(members);

function mostEngaged(most) {
  most.sort(function(a, b) {
    return b.votes_with_party_pct - a.votes_with_party_pct;
  });
  var tenpercent = Math.round(members.length * 0.1);

  var tbody = document.getElementById("thestatisticsobject2");
  //for(most)
  for (var k = 0; k < tenpercent; k++) {
    var senate = most[k];

    var tr = document.createElement("tr");
    var link = document.createElement("a");

    var nameCell = document.createElement("td");
    var missedCell = document.createElement("td");
    var pctCell = document.createElement("td");

    link.setAttribute("href", senate.url);

    if (senate.middle_name == null) {
      senate.first_name = senate.first_name + " " + senate.last_name;
    } else {
      senate.first_name =
        senate.first_name + " " + senate.middle_name + " " + senate.last_name;
    }

    link.innerHTML = senate.first_name;
    nameCell.appendChild(link);

    missedCell.innerHTML = senate.total_votes;
    pctCell.innerHTML = senate.votes_with_party_pct + "%";

    tr.append(nameCell, missedCell, pctCell);
    tbody.appendChild(tr);
  }
}
// mostEngaged(members);
// spinner

//funcion for(sortedMembers) {

//}
