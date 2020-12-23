const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control.js');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    /**
     * Se ejecuta cuando se solicita otro ticket del servitos
     */
    client.on('siguienteTicket', (data, callback) => {
        // Se consulta cual es el siguiente ticket
        let siguiente = ticketControl.siguienteTicket();
        console.log(siguiente);
        // Se envia la respuesta al cliente
        callback(siguiente);
    });

    /**
     * Se le emite al cliente el último ticket que esta en la cola
     */
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimosCuatro()
    });

    // Va a estar pendiende del cliente cuando solicite un ticket para atender
    client.on('atenderTicket', (data, callback) => {

        // Se valida que desde el cliente se envíe el escritorio
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            })
        }
        // Se consulta el ticket que se debe atender
        let atenderTicket = ticketControl.atenderTicket(data.escritorio);
        // Se envia el ticket al cliente
        callback(atenderTicket);

        // Luego, le emitimos al cliente el estado actual de los ticket, para que se actualicen en la pantalla
        // publica
        client.broadcast.emit('estadoActual', {
            actual: ticketControl.getUltimoTicket(),
            ultimos4: ticketControl.getUltimosCuatro()
        });

    });
});