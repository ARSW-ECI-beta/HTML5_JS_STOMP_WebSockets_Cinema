var app = (function () {

    var seats = [[true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
    var c,ctx;
    
    class Seat {
        constructor(row, col) {
            this.row = row;
            this.col = col;
        }
    }
    

    var stompClient = null;

    //get the x, y positions of the mouse click relative to the canvas
    var getMousePosition = function (evt) {
        $('#myCanvas').click(function (e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            console.info(x);
            console.info(y);
        });
  
    };
    
    var drawSeats = function (cinemaFunction) {
        c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");
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
            stompClient.subscribe('/topic/buyticket', function (eventbody) {
               console.alert("evento recibido");
               var theObject=JSON.parse(eventbody.body);

            });
        });

    };

    var verifyAvailability = function (row,col) {
        var st = new Seat(row, col);
        if (seats[row][col]===true){
            seats[row][col]=false;
            console.info("purchased ticket");
            stompClient.send("/app/buyticket", {}, JSON.stringify(st)); 
            
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
            console.info("buying ticket at row: " + row + "col: " + col);
            verifyAvailability(row,col);
            
            //buy ticket
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