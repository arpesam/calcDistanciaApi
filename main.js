const request = require('request');
const express = require('express');
const app = express();
const yargs = require('yargs');
const bodyParser = require('body-parser')

//caso deseje poderá fazer a requisição via console para o google maps e descobrir a distância caso o percurso seja feito de carro, a pé, etc...
//abaixo estão os parâmetros necessários para fazer a requisição pelo google maps api. É possível mudar também a porta padrão no qual o servidor irá rodar
const argv = yargs
    .options({
        port:{demand: false, describe: 'porta', integer: true}
            },{
        lat1: {demand: false, describe: "latitude da origem", string: true},
        long2: {demand: false, describe: "longitude da origem", string: true},
        lat2: {demand: false, describe: "latitude do destino", string: true},
        long2: {demand: false, describe: "latitude do destino", string: true},
    })
    .argv;

// seta porta como 3000 ou uma recebida via console para uso no servidor 
const porta = argv.port || 3000

// verifica se foram passador parametros via console e se todos os parâmetros foram passados
if ((argv.lat1 != undefined) && (argv.long1 != undefined) && (argv.lat2 != undefined) && (argv.long2 != undefined)){
    // usa o request para fazer a requisição a api do google e passa os parâmetros 
    request({
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=metrics&origins=${argv.lat1},${argv.long1}&destinations=${argv.lat2},${argv.long2}&key=AIzaSyCFabjNy2aWJxNYSx-bGvyemYsbtOOaCDs`,
        json: true
        }, (error, res, body) => {
            // verifica se houve resposta positiva da api google, i.e, se as coordenadas estão corretas e se houve o calculo
        if (body.status == "OK" && body.rows[0].elements[0].status == "OK"){
            const distance = body.rows[0].elements[0].distance.value;
            if (distance){
                // mostra a distância em metros no console
                console.log(`Distância da rota de acordo com o Google Maps: ${distance} metros`);
            }
        }else{
            //caso exista erro, msg de erro
            console.log(`Não há parâmetros informados pelo console, aguardando requisições HTTP na porta ${porta} | erro: ${error}`);
        };
    });
};

// utilizando o body-parser para conversão
app.use(bodyParser.json());

// requisição get criada apenas para teste da aplicação
app.get('/', (req, res) => {
    res.send('Aplicação funcionando!');
});

// requisição post para calcular distância
app.post('/api/calcular/', (req, res) => {
    // algoritimo de calculo de distâncias copiado e adaptado do stackoverflow 
    // https://pt.stackoverflow.com/questions/251479/dist%C3%A2ncia-em-metros-entre-duas-coordenadas-usando-javascript
    function getDistanceFromLatLonInKm(position1, position2) {
        "use strict";
        var deg2rad = function (deg) { return deg * (Math.PI / 180); },
            R = 6371,
            dLat = deg2rad(position2.lat2 - position1.lat1),
            dLng = deg2rad(position2.long2 - position1.long1),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(deg2rad(position1.lat1))
                * Math.cos(deg2rad(position1.lat1))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat(((R * c *1000).toFixed(2)));
    }
    
    // recebe as coordenadas do body e desestrutura o objeto
    const coordinates = req.body
    const {lat1, long1, lat2, long2} = coordinates
    // desestruturação para criação dos dois parâmetros necessários para a função 'getDistanceFromLatLonInKm()'
    const position1 = {lat1, long1}
    const position2 = {lat2, long2}
    const distancia = (getDistanceFromLatLonInKm(position1,position2));
    // resposta da distância
    res.json(distancia)
});

// seta a porta usada pelo servidor 
app.listen(porta, () => {
    console.log(`Servidor na porta: ${porta}`);
});