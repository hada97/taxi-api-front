const baseUrl =
  "https://tax-docker-byaue6dfe3c0e0eq.canadacentral-01.azurewebsites.net";
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
          listarUsers(); // Função para listar os usuários cadastrados
          alert("Usuário cadastrado com sucesso!");
          document.getElementById("cadastroUserForm").reset();
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        alert("Ocorreu um erro ao tentar cadastrar: " + error.message);
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
          listarMotoristas(); // Função para listar os motoristas cadastrados
          alert("Motorista cadastrado com sucesso!");
          document.getElementById("cadastroMotoristaForm").reset();
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        alert("Ocorreu um erro ao tentar cadastrar: " + error.message);
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
          listarCorridas(); // Função para listar as corridas cadastradas
          alert("Corrida cadastrada com sucesso!");
          document.getElementById("cadastroCorridaForm").reset();
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        alert("Ocorreu um erro ao tentar cadastrar: " + error.message);
      } finally {
        toggleLoader(false);
      }
    });

  document
    .getElementById("btnListarUser")
    .addEventListener("click", listarUsers);
  async function listarUsers() {
    try {
      toggleLoader(true);
      const response = await fetch(apiUrlUsers);
      const data = await response.json();
      console.log(data);
      const usuarioList = document.getElementById("UserList");
      usuarioList.innerHTML = ""; // Limpa a lista

      if (response.ok) {
        data.forEach((usuario) => {
          const div = document.createElement("div");
          div.textContent = `ID: ${usuario.id}, ${usuario.name}`;
          usuarioList.appendChild(div);
        });
      } else {
        alert(
          "Erro ao listar usuários: " + (data.message || "Erro inesperado")
        );
      }
    } catch (error) {
      alert("Ocorreu um erro ao tentar listar usuários: " + error.message);
    } finally {
      toggleLoader(false);
    }
  }

  // Listar drivers
  document
    .getElementById("btnListarMotorista")
    .addEventListener("click", listarMotoristas);
  async function listarMotoristas() {
    try {
      toggleLoader(true);
      const response = await fetch(apiUrlMotoristas, {});
      const data = await response.json();
      const motoristaList = document.getElementById("motoristaList");
      motoristaList.innerHTML = "";
      if (response.ok) {
        data.forEach((motorista) => {
          const div = document.createElement("div");
          div.textContent = `${motorista.name}, Placa: ${motorista.placa}, ${motorista.status}`;
          motoristaList.appendChild(div);
        });
      }
    } catch (error) {
      alert("Ocorreu um erro ao tentar listar: " + error.message);
    } finally {
      toggleLoader(false);
    }
  }

  // Listar corridas em ANDAMENTO
  document
    .getElementById("btnListarCorrida")
    .addEventListener("click", listarCorridas);
  async function listarCorridas() {
    try {
      toggleLoader(true);
      const response = await fetch(apiUrlCorridasANDAMENTO, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const corridaList = document.getElementById("corridaList");
      corridaList.innerHTML = "";
      if (response.ok) {
        data.forEach((corrida) => {
          const div = document.createElement("div");
          div.textContent = `Corrida ${corrida.id}, User ${corrida.user.id}, Driver ${corrida.driver.id}, ${corrida.status}`;
          corridaList.appendChild(div);
        });
      }
    } catch (error) {
      alert("Ocorreu um erro ao tentar listar: " + error.message);
    } finally {
      toggleLoader(false);
    }
  }

  // Listar corridas em CONCLUIDAS
  document
    .getElementById("btnListarCorridaConcluidas")
    .addEventListener("click", listarCorridasCon);
  async function listarCorridasCon() {
    try {
      toggleLoader(true);
      const response = await fetch(apiUrlCorridasCONCLUIDAS, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const corridaList = document.getElementById("corridaList");
      corridaList.innerHTML = "";
      if (response.ok) {
        data.forEach((corrida) => {
          const div = document.createElement("div");
          div.textContent = `Corrida ${corrida.id}, User ${corrida.user.id}, Driver ${corrida.driver.id}, ${corrida.status}`;
          corridaList.appendChild(div);
        });
      }
    } catch (error) {
      alert("Ocorreu um erro ao tentar listar: " + error.message);
    } finally {
      toggleLoader(false);
    }
  }

  function recarregarPagina() {
    location.reload();
  }
});

// Função para buscar corrida específica
async function buscarCorrida(id) {
  const response = await fetch(`${apiUrlCorridas}/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar a corrida");
  }
  const corrida = await response.json();
  return corrida;
}

// Função para geocodificar (obter coordenadas)
async function geocode(local) {
  const apiKey = "FavFAG60A7v65P6j4vgAxOQ6qYATmwjf";
  const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
    local
  )}.json?key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar coordenadas");
  }

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return [data.results[0].position.lat, data.results[0].position.lon];
  } else {
    console.error("Nenhum resultado encontrado para:", local);
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

async function obterLocalizacaoIP() {
  try {
    // Usando a API com sua chave para obter a localização
    const response = await fetch(
      "https://geo.ipify.org/api/v2/country,city?apiKey=at_DM6H4u0nhYWvOgyly0sLUlhzJ0Vrt"
    );

    if (!response.ok) {
      throw new Error("Falha na requisição: " + response.status);
    }

    const data = await response.json();

    if (data.location && data.location.lat && data.location.lng) {
      return { lat: data.location.lat, lng: data.location.lng };
    } else {
      return { lat: -23.66389, lng: -46.53833 };
    }
  } catch (error) {
    console.error("Erro ao obter a localização:", error);
    return { lat: -23.66389, lng: -46.53833 };
  }
}

//Obtein localizacao do Uuario
async function exibirMapaLocalizacao() {
  const coordenadas = await obterLocalizacaoIP();
  if (!coordenadas) {
    alert("Não foi possível obter a localização.");
    return;
  }
  map = L.map("map").setView(coordenadas, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(coordenadas)
    .addTo(map)
    .bindPopup("Approx. location")
    .openPopup();
}

//Chama a func pra exib o mapa inicial
document.addEventListener("DOMContentLoaded", async () => {
  await exibirMapaLocalizacao();
  document
    .getElementById("btnDetalharCorrida")
    .addEventListener("click", async function () {
      const corridaId = document.getElementById("idCorrida").value;
      if (!corridaId) {
        alert("ID da corrida é necessário.");
        return;
      }
      await detalharCorrida(corridaId);
    });
});

async function detalharCorrida(corridaId) {
  try {
    toggleLoader(true);
    const corrida = await buscarCorrida(corridaId);

    if (!corrida) {
      console.error("Corrida não encontrada.");
      return;
    }

    const origem = corrida.origem;
    const destino = corrida.destino;
    const preco = parseFloat(corrida.preco).toFixed(2);
    const origemCoordinates = await geocode(origem);
    const destinoCoordinates = await geocode(destino);

    if (!origemCoordinates || !destinoCoordinates) {
      console.error("Erro ao obter coordenadas.");
      return;
    }

    const routeData = await obterRotaTomTom(
      origemCoordinates,
      destinoCoordinates
    );

    if (routeData) {
      const listContainer = document.getElementById("detalhecorridaList");
      listContainer.innerHTML = "";

      const distanceInMeters =
        routeData.routes[0].legs[0].summary.lengthInMeters;

      const distanceInKm = (distanceInMeters / 1000).toFixed(1);

      const divDistancia = document.createElement("div");
      divDistancia.textContent = `Distance: ${distanceInKm} Km`;
      listContainer.appendChild(divDistancia);

      const divPreco = document.createElement("div");
      divPreco.textContent = `Price: R$ ${preco}`;
      listContainer.appendChild(divPreco);

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
        map.remove();
      }

      map = L.map("map").setView(origemCoordinates, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const routeCoordinates = routeData.routes[0].legs[0].points.map(
        (point) => [point.latitude, point.longitude]
      );
      L.polyline(routeCoordinates, { color: "blue", weight: 5 }).addTo(map);
      map.fitBounds(L.polyline(routeCoordinates).getBounds());
    }
  } catch (error) {
    console.error("Erro geral:", error);
  } finally {
    toggleLoader(false);
  }
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
      alert("Corrida concluída com sucesso!");
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
      alert("ID da corrida é necessário.");
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

