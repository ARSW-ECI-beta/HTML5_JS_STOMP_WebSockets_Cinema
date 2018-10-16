
### Escuela Colombiana de Ingeniería
### Arquitecturas de Software - ARSW
### Laboratorio - Broker de Mensajes STOMP con WebSockets + HTML5 Canvas. 
### Caso: Cinema bookings

		

Este ejercicio se basa en la documentación oficial de SpringBoot, para el [manejo de WebSockets con STOMP](https://spring.io/guides/gs/messaging-stomp-websocket/).

En este repositorio se encuentra una aplicación SpringBoot que está configurado como Broker de mensajes, de forma similar a lo mostrado en la siguiente figura:

![](https://docs.spring.io/spring/docs/current/spring-framework-reference/images/message-flow-simple-broker.png)

En este caso, el manejador de mensajes asociado a "/app" aún no está configurado, pero sí lo está el broker '/topic'. Como mensaje, se usarán localizaciones de pantalla, pues se espera que esta aplicación permita propagar eventos de compra de asientos seleccionando en el canvas el asiento deseado.

## Parte I.

Para las partes I y II, se utilizará como base [el proyecto de compra/reserva de tickets](https://github.com/ARSW-ECI-beta/REST_CLIENT-SpringBoot-Cinema_Part2), basada en el siguiente diagrama de actividades:

![](img/Activity.png)

Para esto, realice lo siguiente:
1. Agregue en la parte inferior del canvas dos campos para la captura de las posiciones de los asientos a comprar (row, col), y un botón 'Buy tickets' para hacer efectiva la compra

2. Haga que la aplicación HTML5/JS al ingresarle en los campos de row y col y oprimir el botón, si el asiento está disponible, los publique en el tópico: /topic/buyticket . Para esto tenga en cuenta (1) usar el cliente STOMP creado en el módulo de JavaScript y (2) enviar la representación textual del objeto JSON (usar JSON.stringify). Por ejemplo:

	```javascript
	//creando un objeto literal
	stompClient.send("/topic/buyticket", {}, JSON.stringify({row:3,col:5}));
	```

	```javascript
	//enviando un objeto creado a partir de una clase
	stompClient.send("/topic/buyticket", {}, JSON.stringify(pt)); 
	```

3. Dentro del módulo JavaScript modifique la función de conexión/suscripción al WebSocket, para que la aplicación se suscriba al tópico "/topic/buyticket" (en lugar del tópico /TOPICOXX). Asocie como 'callback' de este suscriptor una función que muestre en un mensaje de alerta (alert()) el evento recibido. Como se sabe que en el tópico indicado se publicarán sólo ubicaciones, extraiga el contenido enviado con el evento (objeto JavaScript en versión de texto), conviértalo en objeto JSON, y extraiga de éste sus propiedades (row y col). Para extraer el contenido del evento use la propiedad 'body' del mismo, y para convertirlo en objeto, use JSON.parse. Por ejemplo:

	```javascript
	var theObject=JSON.parse(message.body);
	```
4. Compile y ejecute su aplicación. Abra la aplicación en varias pestañas diferentes (para evitar problemas con el caché del navegador, use el modo 'incógnito' en cada prueba).
5. Ingrese a una función, ingrese los datos, ejecute la acción del botón, y verifique que en todas la pestañas se haya lanzado la alerta con los datos ingresados.

6. Haga commit de lo realizado, para demarcar el avance de la parte 2.

	```bash
	git commit -m "PARTE 1".
	```


## Parte II.

Para hacer mas útil la aplicación, en lugar de capturar las coordenadas con campos de formulario, las va a capturar a través de eventos sobre el elemento de tipo \<canvas>. De la misma manera, en lugar de simplemente mostrar las coordenadas enviadas en los eventos a través de 'alertas', va a cambiar el color de dichos asientos en el canvas simulando la compra de los mismos.

1. Agregue al canvas de la página un manejador de eventos que permita capturar los 'clicks' realizados, bien sea a través del mouse, o a través de una pantalla táctil. Para esto, tenga en cuenta [este ejemplo de uso de los eventos de tipo 'PointerEvent'](https://mobiforge.com/design-development/html5-pointer-events-api-combining-touch-mouse-and-pen) (aún no soportado por todos los navegadores) para este fin. Recuerde que a diferencia del ejemplo anterior (donde el código JS está incrustado en la vista), se espera tener la inicialización de los manejadores de eventos correctamente modularizado, tal [como se muestra en este codepen](https://codepen.io/hcadavid/pen/BwWbrw).
2. Agregue lo que haga falta en sus módulos para que cuando se capturen nuevos 'clicks' en el canvas (si no se ha seleccionado un canvas NO se debe hacer nada):
	1. Se calcule de acuerdo a las coordenadas del canvas y a la ubicación de los asientos, la fila y la columna del asiento sobre el cual se dio 'click'.
	2. Si el asiento está disponible, publique las ubicaciones en el tópico: /topic/buyticket de forma que se compre el boleto dentro de la aplicación. 

3. Ejecute su aplicación en varios navegadores (y si puede en varios computadores, accediendo a la aplicación mendiante la IP donde corre el servidor). Compruebe que a medida que selecciona un asiento (es decir realiza la compra del mismo sin necesidad del botón), la compra del mismo es replicada en todas las instancias abiertas de la aplicación (el asiento cambia de color).

5. Haga commit de lo realizado, para marcar el avance de la parte 2.

	```bash
	git commit -m "PARTE 2".
	```

## Parte III.

Ajuste la aplicación anterior para que pueda manejar la compra de asientos en más de una sala a la vez, manteniendo tópicos independientes. Para esto:


1. Modifique la aplicación para que, en lugar de conectarse y suscribirse automáticamente (en la función init()), lo haga a través de botón 'conectarse'. Éste, al oprimirse debe realizar la conexión y suscribir al cliente a un tópico que tenga un nombre dinámico, asociado el identificador que será el nombre del cine, por ejemplo: /topic/newpoint.cinemaX, topic/newpoint.cinemaY, para los cinemas 'cinemaX' y 'cinemaY' respectivamente.
2. Rectifique que se puedan realizar dos compras de asientos de forma independiente, cada uno de éstos entre dos o más clientes.



	```bash
	git commit -m "PARTE 3".
	```


## Parte IV.

Para la parte IV, usted va  a implementar una versión extendida del modelo de actividades y eventos anterior, en la que el servidor (que hasta ahora sólo fungía como Broker o MOM -Message Oriented Middleware-) se volverá también suscriptor de ciertos eventos, para a partir de los mismos agregar la funcionalidad de 'compra/reserva de entradas de cine':

![](img/P2-AD.png)

Para esto, se va a hacer una configuración alterna en la que, en lugar de que se propaguen los mensajes 'buyticket.{cinemaname}' entre todos los clientes, éstos sean recibidos y procesados primero por el servidor, de manera que se pueda decidir qué hacer con los mismos. 

Para ver cómo manejar esto desde el manejador de eventos STOMP del servidor, revise [puede revisar la documentación de Spring](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#websocket-stomp-destination-separator).


1. Cree una nueva clase que haga el papel de 'Controlador' para ciertos mensajes STOMP (en este caso, aquellos enviados a través de "/app/buyticket.{cinemaname}"). A este controlador se le inyectará un bean de tipo SimpMessagingTemplate, un Bean de Spring que permitirá publicar eventos en un determinado tópico. Por ahora, se definirá que cuando se intercepten los eventos enviados a "/app/buyticket.{cinemaname}" (que se supone deben incluir un punto), se mostrará por pantalla el punto recibido, y luego se procederá a reenviar el evento al tópico al cual están suscritos los clientes "/topic/buyticket".

	```java
	
	@Controller
	public class STOMPMessagesHandler {
		
		@Autowired
		SimpMessagingTemplate msgt;
	    
		@MessageMapping("/buyticket.{cinemaname}")    
		public void handleBuyEvent(Seat st,@DestinationVariable String cinemaName) throws Exception {
			System.out.println("Nuevo asiento recibido en el servidor!:"+st);
			msgt.convertAndSend("/topic/buyticket"+cinemaName, pt);
		}
	}

	```

2. Ajuste su cliente para que, en lugar de publicar los puntos en el tópico /topic/buyticket.{cinemaname}, lo haga en /app/buyticket.{cinemaname}. Ejecute de nuevo la aplicación y rectifique que funcione igual, pero ahora mostrando en el servidor los detalles de los puntos recibidos.

3. Una vez rectificado el funcionamiento, se quiere aprovechar este 'interceptor' de eventos para cambiar ligeramente la funcionalidad:
<!--
	1. Se va a manejar un nuevo tópico llamado '/topic/newpolygon.{numdibujo}', en donde el lugar de puntos, se recibirán objetos javascript que tengan como propiedad un conjunto de puntos.
	2. El manejador de eventos de /app/newpoint.{numdibujo}, además de propagar los puntos a través del tópico '/topic/newpoints', llevará el control de los puntos recibidos(que podrán haber sido dibujados por diferentes clientes). Cuando se completen tres o más puntos, publicará el polígono en el tópico '/topic/newpolygon'. Recuerde que esto se realizará concurrentemente, de manera que REVISE LAS POSIBLES CONDICIONES DE CARRERA!. También tenga en cuenta que desde el manejador de eventos del servidor se tendrán N dibujos independientes!.

	3. El cliente, ahora también se suscribirá al tópico '/topic/newpolygon'. El 'callback' asociado a la recepción de eventos en el mismo debe, con los datos recibidos, dibujar un polígono, [tal como se muestran en ese ejemplo](http://www.arungudelli.com/html5/html5-canvas-polygon/).
	4. Verifique la funcionalidad: igual a la anterior, pero ahora dibujando polígonos cada vez que se agreguen cuatro puntos.
	
	
5. A partir de los diagramas dados en el archivo ASTAH incluido, haga un nuevo diagrama de actividades correspondiente a lo realizado hasta este punto, teniendo en cuenta el detalle de que ahora se tendrán tópicos dinámicos para manejar diferentes dibujos simultáneamente.

5. Haga commit de lo realizado.

	```bash
	git commit -m "PARTE FINAL".
	```	



### Criterios de evaluación

1. La aplicación propaga correctamente los puntos entre todas las instancias abierta de la misma, cuando hay sólo un dibujo.
2. La aplicación propaga correctamente los puntos entre todas las instancias abierta de la misma, cuando hay más de un dibujo.
3. La aplicación propaga correctamente el evento de creación del polígono, cuando colaborativamente se insertan cuatro puntos.
4. La aplicación propaga correctamente el evento de creación del polígono, cuando colaborativamente se insertan cuatro puntos, con 2 o más dibujos simultáneamente.
5. En la implementación se tuvo en cuenta la naturaleza concurrente del ejercicio. Por ejemplo, si se mantiene el conjunto de los puntos recibidos en una colección, la misma debería ser de tipo concurrente (thread-safe).
-->
