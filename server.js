const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const FILE = './employees.json';

const readData = () => {
  return JSON.parse(fs.readFileSync(FILE));
};

const writeData = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

app.get('/employees', (req, res) => {
  res.json(readData());
});

app.post('/employees', (req, res) => {
  const data = readData();
  const emp = req.body;

  if (data.find(e => e.id == emp.id)) {
    return res.status(400).json({message: "Duplicate ID"});
  }

  data.push(emp);
  writeData(data);
  res.json(emp);
});

app.put('/employees/:id', (req, res) => {
  let data = readData();
  const id = req.params.id;

  data = data.map(e => e.id == id ? req.body : e);
  writeData(data);
  res.json(req.body);
});

app.delete('/employees/:id', (req, res) => {
  let data = readData();
  const id = req.params.id;

  data = data.filter(e => e.id != id);
  writeData(data);
  res.json({message: "Deleted"});
});

app.listen(5000, () => console.log("Server running on port 5000"));
