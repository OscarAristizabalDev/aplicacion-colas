// Comando para establece la comunicación
var socket = io();

var label = $('#lblNuevoTicket');

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Desconectad del servidor');
});

/**
 * El cliente esta pendiente de lo que el servidor le envia
 * El servidor le envia el ultimo ticket cada vez que alguien se conecta
 */
socket.on('estadoActual', function(response) {
    label.text(response.actual);
});
// Cada vez que se de click en el button
$('button').on('click', function() {
    // Se emite al servidor que se solicta una nuevo ticket
    socket.emit('siguienteTicket', null, function(siguienteTicket) {
        console.log(siguienteTicket);
        // Se envia el nuevo ticket al label
        label.text(siguienteTicket);
    });
});