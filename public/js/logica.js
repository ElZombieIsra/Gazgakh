var socket = io.connect('http://localhost:8090');
var list = document.querySelector('#lista-users');
var scoreslist = document.querySelector('#scorelist');
var username = window.location.pathname.replace('/chat/', '');
var username2 = window.location.pathname.replace('/results/', '');
var clientes = [];
var Scores = [];
var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
var cuenta = 0;
var letra = '';
var seguir = true;

function conectarChat() {
  var id = socket.id;
  console.log({username: username, id: id});
  $.post('/login', {username: username, id: id}, function (data) {
    if(data!=='nel'){
      clientes = data;
      list.innerHTML += 'Cargando...';
      var html = '';
      clientes.forEach((cliente, i) => {
        html += `<tr>
          <td>${i+1}</td>
          <td>${cliente.username}</td>
          <td id="${'ready'+(cliente.username)}">
            ${cliente.username == username ? ('<button class="btn btn-sm btn-success" onclick="playerReady()">Estoy listo</button>') : ''}
          <td>
        </tr>`;
      });
      list.innerHTML = html;
      $('.loader').hide();
    }
    else{
      swal({
        title: 'Error',
        text: 'Usted ya se encuentra en la sala de juego',
        type: 'error'
      });
    }
  });
}

function playerReady(){
  socket.emit('playerReady', socket.id);
}

function enviarMensaje() {
  var nom = document.querySelector('#nom').value;
  var ap = document.querySelector('#ap').value;
  var cos = document.querySelector('#cos').value;
  var am = document.querySelector('#am').value;
  var flor = document.querySelector('#flor').value;
  var col = document.querySelector('#col').value;
  var lug = document.querySelector('#lug').value;
  var pel = document.querySelector('#pel').value;
  var marc = document.querySelector('#marc').value;


  $.post('/send', {
    username: username,
    id:socket.id,
    nom: nom,
    ap: ap,
    cos: cos,
    am: am,
    flor: flor,
    col: col,
    lug: lug,
    pel: pel,
    marc: marc,
  });
}

var nombre,puntos;

socket.on('jugador_listo', (data)=>{
  $(`#ready${data.username}`).html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #28a745;"><path d="M0 11.522l1.578-1.626 7.734 4.619 13.335-12.526 1.353 1.354-14 18.646z"/></svg>');
});

socket.on('jugador_inicial', (data)=>{
  if(data == username){
    cuentaAtras();
    $(`#ready${data}`).html('<button class="btn btn-sm btn-danger" id="GazgakhReady" onclick="parar()">Gazgakh</button>');
  }
  else{
    $(`#ready${data}`).html('<b class="text-danger">Escogiendo letra</b>');
  }
});

socket.on('socket_conectado', function (data) {
  console.log(data);
  clientes.push(data);
  var html = '';
  clientes.forEach((cliente, i) => {
    html += `<tr>
              <td>${i+1}</td>
              <td>${cliente.username}</td>
              <td id="${'ready'+(cliente.username)}">
                ${cliente.username == username ? ('<button class="btn btn-sm btn-success" onclick="playerReady()">Estoy listo</button>') : ''}
              <td>
            </tr>`;
  });
  list.innerHTML = html;
});

socket.on('socket_desconectado', (client)=>{
  clientes = client;
  var html = '';
  clientes.forEach((cliente, i) => {
    html += `<tr>
    <td>${i+1}</td>
    <td>${cliente.username}</td>
    <td id="${'ready'+(cliente.username)}">
      ${cliente.username == username ? ('<button class="btn btn-sm btn-success" onclick="playerReady()">Estoy listo</button>') : ''}
    <td>
  </tr>`;
  });
  list.innerHTML = html;
});

$(()=>{
  $('#GazgakhReady').off('click').on('click', ()=>{
    console.log('aber');
    seguir = false;
  });
});

function parar(){
  console.log('aber');
  seguir = false;
}

function cuentaAtras(){
  $('#contenedorPrincipal').html(`<div class="display-1 text-center titulo">${abc[cuenta]}</div>`);
  letra = abc[cuenta];
  cuenta >= abc.length-1 ? cuenta = 0 : cuenta++;
  if (seguir) setTimeout(()=>{cuentaAtras()}, 300);
}

setTimeout(()=>{conectarChat();}, 500);