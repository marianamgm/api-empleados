require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

const empleadoSchema = new mongoose.Schema({
  clave: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  fechadenacimiento: { type: Date, required: true },
  sexo: { type: String, required: true },
  tipodesangre: { type: String, required: true }
}, { versionKey: false });

const Empleado = mongoose.model('Empleado', empleadoSchema, 'Empleados');

app.get('/api/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.get('/api/empleados/:clave', async (req, res) => {
  try {
    const empleado = await Empleado.findOne({ clave: Number(req.params.clave) });
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.post('/api/empleados', async (req, res) => {
  try {
    const nuevoEmpleado = new Empleado(req.body);
    const guardado = await nuevoEmpleado.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

app.put('/api/empleados/:clave', async (req, res) => {
  try {
    const actualizado = await Empleado.findOneAndUpdate(
      { clave: Number(req.params.clave) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

app.delete('/api/empleados/:clave', async (req, res) => {
  try {
    const eliminado = await Empleado.findOneAndDelete({ clave: Number(req.params.clave) });
    if (!eliminado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado eliminado exitosamente', eliminado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));