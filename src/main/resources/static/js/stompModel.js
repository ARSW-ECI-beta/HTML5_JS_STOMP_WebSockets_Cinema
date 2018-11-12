var app2 = (function () {

    var seats = [[true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];

    class Seat {
        constructor(row, col) {
            this.row = row;
            this.col = col;
        }
    }
    

    var stompClient = null;


    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    
    var drawSeats = function (cinemaFunction) {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#001933";
        ctx.fillRect(100, 20, 300, 80);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px Arial";
        ctx.fillText("Screen", 180, 70);
        var row = 5;
        var col = 0;
        for (var i = 0; i < seats.length; i++) {
            row++;
            col = 0;
            for (j = 0; j < seats[i].length; j++) {
                if (seats[i][j]) {
                    ctx.fillStyle = "#009900";
                } else {
                    ctx.fillStyle = "#FF0000";
                }
                col++;
                ctx.fillRect(20 * col, 20 * row, 20, 20);
                col++;
            }
            row++;
        }
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/TOPICXX', function (eventbody) {

            });
        });

    };

    var verifyAvailability = function (row,col) {
        if (seats[row][col]){
            seats[row][col]=false;
            console.info("purchased ticket");
        }
        else{
            console.info("Ticket not available");
        }  

    };



    return {

        init: function () {
            var can = document.getElementById("canvas");
            drawSeats();
            //websocket connection
            connectAndSubscribe();
        },

        buyTicket: function (row, col) {
            var st = new Seat(row, col);
            console.info("buying ticket at row: " + row + "col: " + col);
            verifyAvailability();
            addPointToCanvas(pt);

            //publicar el evento
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();