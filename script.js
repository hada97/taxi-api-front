const baseUrl =
  "https://taxi-docker-novo-djcscuapfpcvhkb6.canadacentral-01.azurewebsites.net";
const apiUrlUsers = `${baseUrl}/users`;
const apiUrlMotoristas = `${baseUrl}/drivers`;
const apiUrlCorridas = `${baseUrl}/corridas`;
const apiUrlCorridasANDAMENTO = `${baseUrl}/corridas/andamento`;
const apiUrlCorridasCONCLUIDAS = `${baseUrl}/corridas/concluidas`;
const apiUrlCorridasCONCLUIR = `${baseUrl}/corridas/concluir`;
var map; // Variável global para o mapa

document.addEventListener("DOMContentLoaded", () => {
  // Alternar exibição do formulário de cadastro de usuário
  document
    .getElementById("toggleUserForm")
    .addEventListener("click", function () {
      const formContainer = document.getElementById(
        "cadastroUserFormContainer"
      );
      formContainer.classList.toggle("hidden");
    });

  // Alternar exibição do formulário de cadastro de motorista
  document
    .getElementById("toggleMotoristaForm")
    .addEventListener("click", function () {
      const formContainer = document.getElementById(
        "cadastroMotoristaFormContainer"
      );
      formContainer.classList.toggle("hidden");
    });

  // Alternar exibição do formulário de cadastro de corrida
  document
    .getElementById("toggleCorridaForm")
    .addEventListener("click", function () {
      const formContainer = document.getElementById(
        "cadastroCorridaFormContainer"
      );
      formContainer.classList.toggle("hidden");
    });

  // Cadastro de User
  document
    .getElementById("cadastroUserForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const name = document.getElementById("nomeUser").value;
      const email = document.getElementById("emailUser").value;
      const phone = document.getElementById("telefoneUser").value;

      if (!name || !email || !phone) {
        return;
      }

      try {
        toggleLoader(true); // Exibe o loader
        const response = await fetch(apiUrlUsers, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
          }),
        });

        if (response.ok) {
          alert("User successfully registered!");
          document.getElementById("cadastroUserForm").reset();
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        alert("An error occurred while trying to register: " + error.message);
      } finally {
        toggleLoader(false); // Esconde o loader
      }
    });

  // Cadastro de Motorista
  document
    .getElementById("cadastroMotoristaForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const name = document.getElementById("nomeMotorista").value;
      const email = document.getElementById("emailMotorista").value;
      const phone = document.getElementById("telefoneMotorista").value;
      const cnh = document.getElementById("cnhMotorista").value;
      const placa = document.getElementById("placaMotorista").value;

      if (!name || !email || !phone || !cnh || !placa) {
        return;
      }

      try {
        toggleLoader(true);
        const response = await fetch(apiUrlMotoristas, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            cnh,
            placa,
          }),
        });

        if (response.ok) {
          alert("Driver successfully registered!");
          document.getElementById("cadastroMotoristaForm").reset();
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        alert("An error occurred while trying to register: " + error.message);
      } finally {
        toggleLoader(false);
      }
    });

  // Cadastro de Corrida
  document
    .getElementById("cadastroCorridaForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const idUser = document.getElementById("idUser").value;
      const origem = document.getElementById("origemCorrida").value;
      const destino = document.getElementById("destinoCorrida").value;

      if (!idUser || !origem || !destino) {
        return;
      }

      try {
        toggleLoader(true);
        const response = await fetch(apiUrlCorridas, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idUser,
            origem,
            destino,
          }),
        });

        if (response.ok) {
          alert("Ride successfully registered!");
          document.getElementById("cadastroCorridaForm").reset();
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        alert("An error occurred while trying to register: " + error.message);
      } finally {
        toggleLoader(false);
      }
    });

  // Listar motoristas
  document
    .getElementById("btnListarMotorista")
    .addEventListener("click", () =>
      listarItens(
        apiUrlMotoristas,
        document.getElementById("motoristaList"),
        (motorista) =>
          `${motorista.name}, CAR: ${motorista.placa}, ${motorista.status}`
      )
    );

  // Listar usuários
  document
    .getElementById("btnListarUser")
    .addEventListener("click", () =>
      listarItens(
        apiUrlUsers,
        document.getElementById("UserList"),
        (usuario) => `ID: ${usuario.id}, ${usuario.name}`
      )
    );

  // Listar corridas em andamento
  document.getElementById("btnListarCorrida").addEventListener("click", () =>
    listarItens(
      apiUrlCorridasANDAMENTO,
      document.getElementById("corridaList"),
      (corrida) => {
        let status =
          corrida.status === "INPROGRESS"
            ? corrida.status.substring(0, 6)
            : corrida.status;
        return `ID ${corrida.id}, User ${corrida.user.id}, Driver ${corrida.driver.id}, ${status}`;
      }
    )
  );

  // Listar corridas em concluídas
  document
    .getElementById("btnListarCorridaConcluidas")
    .addEventListener("click", () =>
      listarItens(
        apiUrlCorridasCONCLUIDAS,
        document.getElementById("corridaList"),
        (corrida) => {
          // Verificar o status e substituir se for "COMPLETED"
          let status = corrida.status === "COMPLETED" ? "DONE" : corrida.status;

          return `ID ${corrida.id}, User ${corrida.user.id}, Driver ${corrida.driver.id}, ${status}`;
        }
      )
    );

  function recarregarPagina() {
    location.reload();
  }
});

// Função para geocodificar (obter coordenadas)
async function geocode(local) {
  const apiKey = "FavFAG60A7v65P6j4vgAxOQ6qYATmwjf";
  const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
    local
  )}.json?key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error fetching coordinates");
  }

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return [data.results[0].position.lat, data.results[0].position.lon];
  } else {
    console.error("No results found for: ", local);
    return null;
  }
}

// Função para obter a rota via TomTom
async function obterRotaTomTom(origem, destino) {
  const apiKey = "FavFAG60A7v65P6j4vgAxOQ6qYATmwjf"; // Substitua pela sua chave
  const url = `https://api.tomtom.com/routing/1/calculateRoute/${origem[0]},${origem[1]}:${destino[0]},${destino[1]}/json?key=${apiKey}`;
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar rota");
  }

  const data = await response.json();
  return data;
}

// Obtém a localização do usuário
async function obterLocalizacaoIP() {
  // Usando a API para obter a localização
  const response = await fetch(
    "https://api.ipregistry.co/?key=ira_pHqksS9vwIlpdnsehzL4D0BRaHbToP4XxrEW"
  );

  // Verifica se a resposta não foi ok, retorna valores padrão
  if (!response.ok) return { lat: -23.5681, lng: -46.6492 };

  const data = await response.json();

  // Retorna as coordenadas ou valores padrão se não encontrados
  return {
    lat: data.location?.latitude || -23.5681,
    lng: data.location?.longitude || -46.6492,
  };
}

//Criando mapa com localizacao
async function exibirMapaLocalizacao() {
  const coordenadas = await obterLocalizacaoIP();
  if (!coordenadas) {
    alert("Could not retrieve the location");
    return;
  }
  map = L.map("map").setView(coordenadas, 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Adiciona o pino somente se as coordenadas não forem as padrões (-23.5681, -46.6492)
  if (coordenadas.lat !== -23.5681 || coordenadas.lng !== -46.6492) {
    L.marker(coordenadas).addTo(map).bindPopup("Aprox location").openPopup();
  }
}

//Chama a func pra exib o mapa inicial
document.addEventListener("DOMContentLoaded", async () => {
  await exibirMapaLocalizacao();
  document
    .getElementById("btnDetalharCorrida")
    .addEventListener("click", async function () {
      const corridaId = document.getElementById("idCorrida").value;
      if (!corridaId) {
        alert("Ride ID is required");
        return;
      }
      await detalharCorrida(corridaId);
    });
});

// Função para buscar corrida específica
async function buscarCorrida(id) {
  const response = await fetch(`${apiUrlCorridas}/${id}`);
  if (response.status === 404) {
    alert("Ride not found!");
    return null; // Retorna null ou outra indicação de que a corrida não foi encontrada
  }
  const corrida = await response.json();
  return corrida;
}

// Função para finalizar a corrida
async function finalizarCorrida(corridaId) {
  try {
    toggleLoader(true);
    const response = await fetch(`${apiUrlCorridasCONCLUIR}/${corridaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("Ride completed successfully!");
    } else {
      alert("Não foi possível concluir a corrida.");
    }
  } catch (error) {
    alert("Ocorreu um erro ao tentar concluir a corrida: " + error.message);
  } finally {
    toggleLoader(false);
  }
}

// Adiciona o evento de clique no botão
document
  .getElementById("btnFinalizarCorrida")
  .addEventListener("click", function () {
    const corridaId = document.getElementById("idCorridaConcluir").value;

    if (!corridaId) {
      alert("Ride ID is required");
      return;
    }
    finalizarCorrida(corridaId);
  });

// Função para mostrar ou esconder o loader
function toggleLoader(show) {
  const preloader = document.getElementById("preloader");
  const loader = document.getElementById("loader");
  const carImage = document.getElementById("carImage");

  if (show) {
    preloader.style.display = "flex"; // Exibe o loader
    loader.style.display = "block"; // Exibe o loader animado
    carImage.style.transition = "left 3s ease-out"; // Ativa a animação do carro
    carImage.style.left = "90%"; // Move o carro para a direita
  } else {
    preloader.style.display = "none"; // Esconde o loader
    loader.style.display = "none"; // Esconde a animação
    carImage.style.transition = "none"; // Desativa a animação do carro
    carImage.style.left = "0"; // Retorna o carro para a posição inicial
  }
}

// Função para buscar dados e renderizar a lista
async function listarItens(apiUrl, elementoLista, formatoTexto) {
  try {
    toggleLoader(true);
    const response = await fetch(apiUrl);
    const data = await response.json();
    elementoLista.innerHTML = ""; // Limpa a lista antes de adicionar

    if (response.ok) {
      data.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = formatoTexto(item);
        elementoLista.appendChild(div);
      });
    }
  } catch (error) {
    alert("An error occurred while trying to list: " + error.message);
  } finally {
    toggleLoader(false);
  }
}

//DETALHAR CORRIDA
let cache = {
  origem: null,
  destino: null,
  origemCoordinates: null,
  destinoCoordinates: null,
  routeData: null,
};

async function detalharCorrida(corridaId) {
  try {
    toggleLoader(true);
    const corrida = await buscarCorrida(corridaId);

    if (!corrida) {
      return;
    }

    const origem = corrida.origem;
    const destino = corrida.destino;
    const preco = parseFloat(corrida.preco).toFixed(2);

    if (origem === cache.origem && destino === cache.destino) {
      console.log("Dados em cache, usando coordenadas e rota existentes.");
      // Se a origem e o destino forem iguais, usa as coordenadas e a rota do cache
      var origemCoordinates = cache.origemCoordinates;
      var destinoCoordinates = cache.destinoCoordinates;
      var routeData = cache.routeData;
    } else {
      // Caso contrário, faz novas chamadas para obter as coordenadas e rota
      origemCoordinates = await geocode(origem);
      destinoCoordinates = await geocode(destino);

      if (!origemCoordinates || !destinoCoordinates) {
        console.error("Erro ao obter coordenadas.");
        return;
      }

      routeData = await obterRotaTomTom(origemCoordinates, destinoCoordinates);
      // Atualiza o cache com as novas coordenadas e rota
      cache.origem = origem;
      cache.destino = destino;
      cache.origemCoordinates = origemCoordinates;
      cache.destinoCoordinates = destinoCoordinates;
      cache.routeData = routeData;
    }

    if (routeData) {
      const listContainer = document.getElementById("detalhecorridaList");
      listContainer.innerHTML = ""; // Limpa qualquer conteúdo anterior

      // Converte a distância para quilômetros e exibe
      const distanceInMeters =
        routeData.routes[0].legs[0].summary.lengthInMeters;
      const distanceInKm = (distanceInMeters / 1000).toFixed(1);
      const divDistancia = document.createElement("div");
      divDistancia.textContent = `Distance: ${distanceInKm} Km`;
      listContainer.appendChild(divDistancia);

      // Exibe o preço da corrida
      const divPreco = document.createElement("div");
      divPreco.textContent = `Price: R$ ${preco}`;
      listContainer.appendChild(divPreco);

      // Calcula o tempo de viagem e exibe
      const travelTimeInSeconds =
        routeData.routes[0].legs[0].summary.travelTimeInSeconds;
      const travelTimeInMinutes = travelTimeInSeconds / 60;
      let timeDisplay;

      if (travelTimeInMinutes >= 60) {
        const hours = Math.floor(travelTimeInMinutes / 60);
        const minutes = Math.round(travelTimeInMinutes % 60);
        timeDisplay = `${hours}h ${minutes}min`;
      } else {
        timeDisplay = `${Math.round(travelTimeInMinutes)} min`;
      }

      const divTime = document.createElement("div");
      divTime.textContent = `Time: ${timeDisplay}`;
      listContainer.appendChild(divTime);

      if (map) {
        map.remove(); // Remove o mapa anterior, se existir
      }

      map = L.map("map").setView(origemCoordinates, 12);

      // Adiciona camada do OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Adiciona a rota ao mapa
      const routeCoordinates = routeData.routes[0].legs[0].points.map(
        (point) => [point.latitude, point.longitude]
      );
      L.polyline(routeCoordinates, { color: "blue", weight: 5 }).addTo(map);
      map.fitBounds(L.polyline(routeCoordinates).getBounds());
    }
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    toggleLoader(false);
  }
}
