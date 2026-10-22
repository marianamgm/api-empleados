
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Conectado exitosamente a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));
// Modelo para la colección &quot;alumnos&quot;
const alumnoSchema = new mongoose.Schema({
matricula: String,
nombre: String,
edad:Number
});
const Alumno = mongoose.model('Alumno', alumnoSchema, 'alumnos');
// Endpoint GET: Obtener todos los usuarios
app.get('/api/alumnos', async (req, res) => {
try {
const alumnos = await Alumno.find();
res.json(alumnos);
} catch (error) {
res.status(500).json({ mensaje: error.message });
}
});
// Endpoint POST: Insertar alumno desde Postman
app.post('/api/alumnos', async (req, res) => {
try {
const nuevoAlumno = new Alumno(req.body);
const guardado = await nuevoAlumno.save();
res.status(201).json(guardado);
} catch (error) {
res.status(400).json({ mensaje: error.message });
}
});
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));