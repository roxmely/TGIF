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

if (page == "house.html") {
  url = "https://api.propublica.org/congress/v1/113/house/members.json";
  var pageType = "house";
}
if (page == "senate-data.html") {
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
      start();
      if (pageType == "house")
        localStorage.setItem("houseLocal", JSON.stringify(members));
      if (pageType == "senate")
        localStorage.setItem("senateLocal", JSON.stringify(members));

      console.log(localStorage);
      // llamo a mis funciones para que se me ejecuten

      document.getElementById("loading").style.display = "none";
    });
  // hago el catch después de verificar que no hay ningun error
  // .catch(function(error) {
  //   console.log("Request failed:" + error.message);
  // });
}
function start() {
  if (page == "house.html" || page == "senate-data.html") {
    createTable();
    //showState(members);
    states();
  }
}
// activamos la función
function createTable() {
  var tbody = document.getElementById("table-data");
  // empezamos la tabla desde cero.
  tbody.innerHTML = "";
  for (var i = 0; i < members.length; i++) {
    // creamos el elemento tr
    var newRow = document.createElement("tr");
    // localizamos la ruta de los nombres
    var firstName = members[i].first_name;
    var middleName = members[i].middle_name;
    // ponemos la condición para juntar name, middle name y lastname y que no salga 'null' si no  tuviese middlename
    if (middleName === null) {
      middleName = "";
    }
    var lastName = members[i].last_name;
    var fullname = firstName + " " + middleName + " " + lastName;
    // creamos una variable link donde creamos dentro el elemento 'a' y su atributo 'href'
    var link = document.createElement("a");
    link.setAttribute("href", members[i].url);
    // colocamos dentro de link el nombre completo
    link.innerHTML = fullname;
    // localizamos los siguientes datos en el json
    var party = members[i].party;
    var state = members[i].state;
    var seniority = members[i].seniority;
    var votesParty = members[i].votes_with_party_pct + "% ";
    // creamos una variable donde ponemos todos los datos localizados del json
    var insertCell = [link, party, state, seniority, votesParty];

    if (showData(members[i])) {
      // creamos una condición donde si se ejecuta la función showData, crearemos
      // una variable tableCell donde dentro crearemos el elementeo td, dentro de esta colocaremos
      // los elementos de la variable insertCell, y todo esto lo meteremos dentro de tr
      for (var j = 0; j < insertCell.length; j++) {
        var tableCell = document.createElement("td");
        tableCell.append(insertCell[j]);
        newRow.append(tableCell);
      }
      document.getElementById("table-data").append(newRow);
    }
  }
  // ponemos este if fuera de los dos for para que si o si cuando la tabla esté vacia me ejecute el mensaje.
  if (document.getElementById("table-data").innerHTML === "") {
    var found = document.createElement("p");
    found.setAttribute("class", "color");
    found.innerHTML = "Sorry No results found";
    found.style.color = "red";

    document.getElementById("table-data").appendChild(found);

    console.log(found);
  }
}

// El método querySelectorAll() de un Element devuelve una NodeList estática (no viva) que representa
// una lista de elementos del documento que coinciden con el grupo de selectores indicados
// me devolvera una nodelist con todos los elementos de nombre 'filtro'
document
  .querySelectorAll("input[name=filtro]")[0]
  .addEventListener("click", createTable);
document
  .querySelectorAll("input[name=filtro]")[1]
  .addEventListener("click", createTable);
document
  .querySelectorAll("input[name=filtro]")[2]
  .addEventListener("click", createTable);
// función mostrar miembros, variable checkBox contendrá una nodelist de las 3 id: 'R,I,D'.
// la variable checkedParty se irá rellenando con las id que se seleccionen al dar al checkbox.
function showData(members) {
  var dropdown = document.getElementById("filterstate").value;
  //var checkBox = document.querySelectorAll("input[name=filtro]");
  var checkedParty = document.querySelectorAll("input[name=filtro]:checked");

  // si la longitud de checkedParty y dropdown esta en 'All', retornamos true. quiere decir
  // que mostramos la lista entera.
  if (
    checkedParty.length === 0 &&
    (dropdown == "All" || dropdown === members.state)
  ) {
    return true;
  }

  for (var j = 0; j < checkedParty.length; j++) {
    if (
      members.party == checkedParty[j].value &&
      (dropdown === members.state || dropdown === "All")
    ) {
      return true;
    }
  }

  return false;
}

// esto sucede cuando el valor del elemento cambia
document.getElementById("filterstate").addEventListener("change", createTable);

function states() {
  var filter = [];
  // -1 es si no se encuentra el elemento, en este caso la condiciòn es: si en la variable
  // filter no está el estado de members[i].state, le añadimos ese estado a la variable filter, lo ejecutaremos
  // tantas veces sea la longitud de members, así obtendremos todos los estados en el array filter.
  for (i = 0; i < members.length; i++) {
    if (filter.indexOf(members[i].state) == -1) {
      filter.push(members[i].state);
    }
  }
  filter.sort();
  // ahora con la longitud de filter, creamos un elemento llamado option, y a option le creamos una clase llamada
  // stateOptions,
  for (var j = 0; j < filter.length; j++) {
    var option = document.createElement("option");
    option.classList.add("stateOptions");
    // le atribuimos el value de filter = All
    option.setAttribute("value", filter[j]);
    // reemplazamos ell contenido de option por filter[j]
    option.innerHTML = filter[j];

    var options = document.getElementById("filterstate");
    options.appendChild(option);
  }
}
