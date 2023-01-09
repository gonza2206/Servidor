BROKER MQTT CON MOSCA Y SERVIDOR HTTP. 

Packetes node para que funcione el server. 
1) npm init --y 
2) npm i -E -D nodemon
3) npm i -E express
4) npm i dotenv
5) npm i -E mongoose
6) npm install mqtt     
7) npm install mqtt jsonschema@1.2.6 mosca      //Brocker mqtt
8) npm install -g typescript //Para hace typeScript 
9) npm i body-parser --save  //Para parsear los datos de la base de datos 

CAMBIAR EN EL PACKET JSON: 
"type": "module",

CORRER LA APLICACION CON:
npm run dev

Para iniciar el sub hay que escribir el comando node sub 

Es necesario iniciar un Sub para poder acceder a la informacion que este enviando el ESP. Una vez iniciado lee el valor y lo guarda en una base de datos en MongoDB.
