const fs = require('fs');
const path = require('path');
const express = require('express');


const app = express();
const port = '3000';


const carrosPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let carrosData = fs.readFileSync(carrosPath, 'utf-8');
let carros = JSON.parse(carrosData);

function saveDados() {
    fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 4));
} 

function ndCarroByName(nome) {
    return carros.find(carros => 
        carros.nome.toLowerCase() === nome.toLowerCase());
}

// carro novo
app.get('/add-car', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionar_carro.html'));
});

app.post('/add-car', (req, res) => {
const newCarro = req.body;

if (carros.find(carros => carros.nome.toLowerCase() == newCarro.nome.toLowerCase())) {
res.send('<h1>Car already exists. Cannot add duplicates.</h1>');
return;
}

carros.push(newCarro);
saveDados();
res.send('<h1>Car added successfully!</h1>');
});


//rota Carros classicos
app.get('/cars/classics', (req, res) => {
fs.readFile(path.join(__dirname, 'carros_classicos.json'), 'utf-8', (err, data) => {
if (err) {
res.status(404).send('Error reading classics cars le.');
return;
}
res.json(JSON.parse(data));
});
});


//rota Carros esportes
app.get('/cars/sports', (req, res) => {
fs.readFile(path.join(__dirname, 'carros_esportivos.json'), 'utf-8', (err, data) => {
if (err) {
res.status(404).send('Error reading sports cars le.');
return;
}
res.json(JSON.parse(data));
});
});


//rota Carros luxo
app.get('/cars/luxury', (req, res) => {
fs.readFile(path.join(__dirname, 'carros_luxo.json'), 'utf-8', (err, data) => {
if (err) {
res.status(404).send('Error reading luxury cars le.');
return;
}
res.send(JSON.parse(data));
});
});


//Procura carro
app.get('/cars/:nome', (req, res) => {
const carName = req.params.nome;
const carroFound = ndCarroByName(carName);
if (carroFound) {
    res.send(`<h1>Car found.</h1><pre>
     ${JSON.stringify(carroFound, null, 2)}</pre>`);
} else {
res.send('<h1>Car not found.</h1>');
}
});




app.listen(port, () => {
console.log(`Server started at http://localhost:${port}`);
});