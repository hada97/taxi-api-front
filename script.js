const baseUrl = "http://localhost:8080";
const apiUrlUsers = `${baseUrl}/users`;
const apiUrlMotoristas = `${baseUrl}/drivers`;
const apiUrlCorridas = `${baseUrl}/corridas`;
const apiUrlCorridasANDAMENTO = `${baseUrl}/corridas/andamento`;
const apiUrlCorridasCONCLUIDAS = `${baseUrl}/corridas/concluidas`;
const apiUrlCorridasCONCLUIR = `${baseUrl}/corridas/concluir`;
var map; // Variável global para o mapa

function toggleLoader(ativo) {
  const loaderElement = document.getElementById("loader"); // Supondo que você tenha um elemento com id "loader"
  if (ativo) {
    loaderElement.classList.remove("hidden"); // Mostra o loader
  } else {
    loaderElement.classList.add("hidden"); // Esconde o loader
  }
}

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
      }
    });

  document
    .getElementById("btnListarUser")
    .addEventListener("click", listarUsers);
  async function listarUsers() {
    try {
      toggleLoader(true); // Se você tiver uma função de loader, mostre o carregamento
      const response = await fetch(apiUrlUsers);
      const data = await response.json();
      console.log(data);
      const usuarioList = document.getElementById("UserList");
      usuarioList.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

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
      toggleLoader(false); // Esconde o carregamento
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

  // Exemplo de recarregar a página
  function recarregarPagina() {
    location.reload();
  }
});

// Função para buscar corrida específica
async function buscarCorrida(id) {
  const response = await fetch(`http://localhost:8080/corridas/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar a corrida");
  }
  const corrida = await response.json();
  return corrida;
}

// Função para geocodificar (obter coordenadas)
async function geocode(local) {
  const apiKey = "FavFAG60A7v65P6j4vgAxOQ6qYATmwjf"; // Substitua pela sua chave do TomTom
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
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();

    if (data.status === "success") {
      const { lat, lon } = data; // latitude e longitude
      return [lat, lon];
    } else {
      throw new Error("Erro ao obter a localização: " + data.message);
    }
  } catch (error) {
    console.error("Erro ao obter a localização por IP:", error);
    return null;
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
    .bindPopup("Sua localização atual")
    .openPopup();
}

//Chama a func pra exib o mapa inicial
document.addEventListener("DOMContentLoaded", async () => {
  await exibirMapaLocalizacao();
  // Exemplo de evento que altera o mapa para o da corrida
  document
    .getElementById("btnDetalharCorrida")
    .addEventListener("click", async function () {
      const corridaId = document.getElementById("idCorrida").value;
      // Verifica se o ID da corrida está presente
      if (!corridaId) {
        alert("ID da corrida é necessário.");
        return;
      }
      await detalharCorrida(corridaId);
    });
});

// Definir a função detalharCorrida
async function detalharCorrida(corridaId) {
  try {
    const corrida = await buscarCorrida(corridaId); // Buscando a corrida com o ID

    if (!corrida) {
      console.error("Corrida não encontrada.");
      return;
    }

    const origem = corrida.origem;
    const destino = corrida.destino;
    const preco = parseFloat(corrida.preco).toFixed(2); // Formata o preço com 2 casas decimais

    // Passo 2: Obter coordenadas de origem e destino
    const origemCoordinates = await geocode(origem);
    const destinoCoordinates = await geocode(destino);

    if (!origemCoordinates || !destinoCoordinates) {
      console.error("Erro ao obter coordenadas.");
      return;
    }

    // Passo 3: Requisição da rota via API TomTom
    const routeData = await obterRotaTomTom(
      origemCoordinates,
      destinoCoordinates
    );

    if (routeData) {
      // Limpar a lista de detalhes da corrida antes de exibir os novos dados
      const listContainer = document.getElementById("detalhecorridaList");
      listContainer.innerHTML = ""; // Limpar todos os elementos dentro da div

      // Acessando a distância corretamente dentro de 'summary'
      const distanceInMeters =
        routeData.routes[0].legs[0].summary.lengthInMeters;

      // Convertendo a distância para quilômetros
      const distanceInKm = (distanceInMeters / 1000).toFixed(1);

      // Criando a div para distância
      const divDistancia = document.createElement("div");
      divDistancia.textContent = `Distância: ${distanceInKm} Km`;
      listContainer.appendChild(divDistancia);

      const divPreco = document.createElement("div");
      divPreco.textContent = `Preço: R$ ${preco}`;
      listContainer.appendChild(divPreco);

      if (map) {
        map.remove(); // Remove o mapa existente
      }

      // Criar um novo mapa com as coordenadas de origem
      map = L.map("map").setView(origemCoordinates, 12);

      // Adiciona o tileLayer do OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Desenha a nova rota no mapa
      const routeCoordinates = routeData.routes[0].legs[0].points.map(
        (point) => [point.latitude, point.longitude]
      );

      // Desenhando a rota no mapa
      L.polyline(routeCoordinates, { color: "blue", weight: 5 }).addTo(map);

      // Ajusta o mapa para os limites da rota
      map.fitBounds(L.polyline(routeCoordinates).getBounds());
    }
  } catch (error) {
    console.error("Erro geral:", error);
  }
}

// Função para finalizar a corrida
async function finalizarCorrida(corridaId) {
  try {
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
  }
}

// Adiciona o evento de clique no botão
document
  .getElementById("btnFinalizarCorrida")
  .addEventListener("click", function () {
    const corridaId = document.getElementById("idCorridaConcluir").value;

    // Verifica se o ID da corrida está presente
    if (!corridaId) {
      alert("ID da corrida é necessário.");
      return;
    }

    // Chama a função finalizarCorrida passando o ID da corrida
    finalizarCorrida(corridaId);
  });
