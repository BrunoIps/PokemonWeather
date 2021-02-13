// Pegando a API Weater Open
const api = {
  key: "b5856d10d65667d5cb5cc3146b47d349",
  baseurl: "https://api.openweathermap.org/data/2.5/"
}
//Pegando a API dos Pokemon por tipo
const apiPokemon = {
  normal: "https://pokeapi.co/api/v2/type/1",
  ground: "https://pokeapi.co/api/v2/type/5",
  rock: "https://pokeapi.co/api/v2/type/6",
  bug: "https://pokeapi.co/api/v2/type/7",
  fire: "https://pokeapi.co/api/v2/type/10",
  water: "https://pokeapi.co/api/v2/type/11",
  grass: "https://pokeapi.co/api/v2/type/12",
  eletric: "https://pokeapi.co/api/v2/type/13",
  ice: "https://pokeapi.co/api/v2/type/15",
  all: " https://pokeapi.co/api/v2/pokemon",
  name: "ditto"
}
//fazendo a descontrução da const apiPokemon
const { normal, ground, rock, bug, fire, water, grass, eletric, ice, all, name } = apiPokemon;

//
const pokemonAPI = {
  normal: `${normal}`,
  ground: `${ground}`,
  rock: `${rock}`,
  bug: `${bug}`,
  fire: `${fire}`,
  water: `${water}`,
  grass: `${grass}`,
  eletric: `${eletric}`,
  ices: `${ice}`,
}

const elCampo = document.getElementById("campo"); //Colocando o elemento do Campo de escrita em uma variavel
const elButton = document.getElementById("button"); // Colocando o botão em uma variavel
const elLanguage = document.getElementById("ptbr-en"); // Colocando o botao para mudar a linguagem em uma variavel
const elInput = document.getElementById("campo") // Colocando o input em uma variavel


//codigo para mudar a linguagem do programa
let pt = true;
elLanguage.onclick = () => {
  pt = !pt;
  if (pt == false) {
    elInput.placeholder = "Search for a City";
    elLanguage.innerText = "EN";
    elButton.innerText = "Search";
  } 
  else {
    elLanguage.innerText = "PT";
    elButton.innerText = "Procurar";
    elInput.placeholder = "Procure por uma cidade";
  }
}

//Aqui uso para poder fazer a pesquisar ao clicar o Enter sem precisar acionar o botão feito pelo Bootstrap
const serachbox = document.querySelector('.city-box ');
serachbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(serachbox.value);
  }
}

//função do click do botão do bootstrap
elButton.onclick = () => {
  getResults(elCampo.value);
}

function getResults(query) {
  fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}&lang={lang}`)
    .then(weather => {
      if (weather.status == 404) {
        alert("Preencha corretamente o campo");
      }
      return weather.json();

    }).then(displayResults);

}

//função onde vamos puxar as informações das API
function pokice(a) {
  let type = "";
  if (a == 1) { pokes = pokemonAPI.normal; pt ? type = "Pokemon do tipo Normal" : type = "Type: normal" }
  if (a == 5) { pokes = pokemonAPI.ground; pt ? type = "Pokemon do tipo Terra" : type = "Type: Ground " }
  if (a == 6) { pokes = pokemonAPI.rock; pt ? type = "Pokemon do tipo Pedra" : type = "Type: Rock " }
  if (a == 7) { pokes = pokemonAPI.bug; pt ? type = "Pokemon do tipo Inseto" : type = "Type: Bug " }
  if (a == 10) { pokes = pokemonAPI.fire; pt ? type = "Pokemon do tipo Fogo" : type = "Type: Fire " }
  if (a == 11) { pokes = pokemonAPI.water; pt ? type = "Pokemon do tipo Água" : type = "Type: Water " }
  if (a == 12) { pokes = pokemonAPI.grass; pt ? type = "Pokemon do tipo Grama" : type = "Type: Grass " }
  if (a == 13) { pokes = pokemonAPI.eletric; pt ? type = "Pokemon do tipo Elétrico" : type = "Type: Eletric " }
  if (a == 15) { pokes = pokemonAPI.ices; pt ? type = "Pokemon do tipo Gelo" : type = "Type: Ice" }

  fetch(pokes)
    .then((data) => data.json())
    .then((pokemon) => generateHTML(pokemon))

  const generateHTML = (data) => {
    const pok = data.pokemon[Math.floor(Math.random() * data.pokemon.length)];
    let hi = document.querySelector('.hi-low');
    hi.innerText = `${type}: ${pok.pokemon.name}`

    const apiUrl = `${all}/${pok.pokemon.name}`
    fetch(apiUrl)
      .then((datas) => datas.json())
      .then((pokemons) => generateimg(pokemons))

    const generateimg = (datas) => {
      const html = `
        <img height="400px" width="400px" src=${datas.sprites.front_default} alt="imagem do ${pok.pokemon.name}"> `
      const pokemonDiv = document.querySelector('.pokemon');
      pokemonDiv.innerHTML = html;
    }
  }
}

function displayResults(weather) {
  // Exibir o nome da cidade e o Pais
  let city = document.querySelector('.city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  //Exibir a data atual
  let today = new Date();
  let date = document.querySelector('.date');
  date.innerText = dateBuild(today);

  //Exibir a temperatura
  let temp = document.querySelector('.temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

  //Constantes criadas para facilitar a utilização dos if's
  const temperatura = Math.round(weather.main.temp);
  const chuva = weather.weather[0].main;

  // Condições criadas para mostrar tipos diferentes de Pokemon conforme a temperatura e a condição climática
  if (temperatura < 5 && weather.weather[0].main != "Rain") { pokice(15); }

  if (temperatura >= 5 && temperatura < 10 && chuva != "Rain") { pokice(11); }

  if (temperatura >= 23 && temperatura < 27 && chuva != "Rain") { pokice(7); }

  if (temperatura == 10 || temperatura == 11 || temperatura == 22 && chuva != "Rain") { pokice(1); }

  if (temperatura >= 12 && temperatura < 15 && chuva != "Rain") { pokice(12); }

  if (temperatura >= 15 && temperatura < 21 && chuva != "Rain") { pokice(5); }

  if (temperatura >= 27 && temperatura <= 33 && chuva != "Rain") { pokice(6); }

  if (temperatura > 33 && chuva != "Rain") { pokice(10); }

  if (chuva == "Rain") { pokice(13); }

  //Exibe a condição climática por exemplo "Rain" está chovendo
  let weathers = document.querySelector('.weather');
  weathers.innerText = chuva;

}

//função para criar as datas (somente em inglês)
function dateBuild(d) {

  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  let dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];


  if (pt == false) {
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`;
  }
  else {
    let day = dias[d.getDay()];
    let date = d.getDate();
    let month = meses[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`;
  } 
}

