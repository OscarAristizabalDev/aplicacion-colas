// Comando para establece la comunicación
var socket = io();

// Objeto que permite obtener los parametros enviados por URL
var searchParams = new URLSearchParams(window.location.search);

// Se valida en la URL venga una variabe escritorio
if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}
// Se obtiene el numero del escritorio enviado por la url
var escritorio = searchParams.get('escritorio');

var label = $('small');

$('h1').text('Escritorio ' + escritorio);

$('button').on('click', function() {
    // Se solicita al servidor el ticker que se debe atender
    socket.emit('atenderTicket', { escritorio: escritorio }, function(resp) {
        // en caso de que no hayan mas tickets
        if (resp === 'No hay tickets') {
            label.text(resp);
            alert(resp);
            return;
        }
        //
        label.text('ticket ' + resp.numero);
    });
});