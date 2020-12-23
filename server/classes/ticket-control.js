// importar clase para trabar con lectura y escritura de archivos
const fs = require('fs');


class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

/**
 * Clase para controlar los ticket registrados
 */
class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        let data = require('../data/data.json');
        this.tickets = [];
        this.ultimosCuatroTickets = [];

        // Se valida si el día registrado en data json es igual al de hoy
        if (data.hoy === this.hoy) {
            // indicamos cual es el ultimo ticket
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimosCuatroTickets = data.ultimosCuatroTickets;
        } else {
            // Se reincia el conteo
            this.reiniciarConteo();
        }
    }

    /**
     * Permite reinicar conteo
     */
    reiniciarConteo() {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimosCuatroTickets = [];
        this.grabarArchivo();
    }

    /**
     * Permite avanzar en el siguiente ticket
     */
    siguienteTicket() {
        // Se le suma al ultimo un 1 para identificar el siguiente
        this.ultimo += 1;
        // Se instancia un nuevo ticket
        let ticket = new Ticket(this.ultimo, null);
        // Se envia el ticket al array de tickets
        this.tickets.push(ticket);
        // Se graba la data con los nuevos valores
        this.grabarArchivo();
        // Se retorna la información
        return `Ticket ${this.ultimo}`;
    }

    /*
     * Permite grabar los cambios de la data.
     */
    grabarArchivo() {
        // Variable para indicar el ultimo, el dia actual, y los tickets regisstrados
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimosCuatroTickets: this.ultimosCuatroTickets
        };
        // Se hace la conversion de la información a registrae
        let jsonDataString = JSON.stringify(jsonData);
        // Se registra la información con los valores inicializados
        fs.writeFileSync('./server/data/data.json', jsonDataString);

        //console.log('Se ha reinicilizado el servidor');
    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    }


    getUltimosCuatro() {
        return this.ultimosCuatroTickets;
    }

    atenderTicket(escritorio) {
        // Ya no hay tickets
        if (this.tickets.length === 0) {
            return `No hay tickets`;
        }
        //Se obtiene el numero del primer ticket
        let numeroTicket = this.tickets[0].numero;
        // Se elimina el ticket de la posicion del listado de tickets
        this.tickets.shift();
        // Se crea un nuevo ticket el cual se va atender
        let atendeTicket = new Ticket(numeroTicket, escritorio);
        // Se agrega el ticker atender en la primer posicion
        this.ultimosCuatroTickets.unshift(atendeTicket);
        // Si hay mas de 4 tickets
        if (this.ultimosCuatroTickets.length > 4) {
            // Elimina el ultimo ticket
            this.ultimosCuatroTickets.splice(-1, 1)
        }

        console.log('Ultimos 4');
        console.log(this.ultimosCuatroTickets);

        this.grabarArchivo();

        return atendeTicket;
    }

}

module.exports = {
    TicketControl
}