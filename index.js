/*
  Desafio proposto no processo seletivo para Desenvolvedor Back End na Quero

  Gerenciador de Palestras
*/

//O Express é usado para a criação da API e aqui é incluído no programa
const express = require("express");

//Inicialização do Express
const server = express();

//Indica ao programa que usaremos JSON no body da aplicação
server.use(express.json());

//Rota POST
server.post("/palestras", (req, res) => {
  //Pega o imput que vem no body
  const { data } = req.body;

  //Chama uma função que organiza as tracks.
  //A função recebe a lista de eventos como parâmetro
  const tracks = OrganizaTracks(data);

  //retorna para o front end as tracks organizadas
  return res.send({ data: tracks });
});

//Função que organiza as tracks
function OrganizaTracks(palestras) {
  let tracksAux = [
    {
      trk: {
        title: "Track 1",
        data: ["12:00PM Lunch", "05:00PM Network Event"]
      },
      remainingM: 180,
      remainingT: 240
    }
  ];
  let tracks = [];

  for (j = 0; j < tracksAux.length; j++) {
    let timeManha = "09:00";
    let timeTarde = "01:00";
    for (i = 0; i < palestras.length; i++) {
      let tmp = palestras[i].match(/(\d+)/g);
      let tempo = tmp != null ? tmp[tmp.length - 1] : 5;
      if (tracksAux[j].remainingM - tempo >= 0) {
        tracksAux[j].remainingM -= tempo;
        const lunchIndex = tracksAux[j].trk.data.indexOf("12:00PM Lunch");
        tracksAux[j].trk.data.splice(
          lunchIndex,
          0,
          timeManha + "AM " + palestras[i]
        );
        timeManha = GetTime(timeManha, tempo);
        palestras.splice(i, 1);
        i--;
      } else if (tracksAux[j].remainingT - tempo >= 0) {
        tracksAux[j].remainingT -= tempo;
        const eventIndex = tracksAux[j].trk.data.indexOf(
          "05:00PM Network Event"
        );
        tracksAux[j].trk.data.splice(
          eventIndex,
          0,
          timeTarde + "PM " + palestras[i]
        );
        timeTarde = GetTime(timeTarde, tempo);
        palestras.splice(i, 1);
        i--;
      }
    }
    tracks.push(tracksAux[j].trk);
    if (palestras.length > 0) {
      tracksAux.push({
        trk: {
          title: "Track " + (j + 2),
          data: ["12:00PM Lunch", "05:00PM Network Event"]
        },
        remainingM: 180,
        remainingT: 240
      });
    }
  }
  return tracks;
}

//função que soma os minutos ao horário anterior para calcular o inicio da próxima palestra
function GetTime(inicio, minutos) {
  var d = new Date();
  var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  var time = date + " " + inicio;
  var newTime = new Date(Date.parse(time) + minutos * 60 * 1000);
  return (
    ("0" + newTime.getHours()).slice(-2) +
    ":" +
    ("0" + newTime.getMinutes()).slice(-2)
  );
}

//Coloca o programa para escutar a porta 3000, onde serão feitas as requisições
server.listen(3000);
