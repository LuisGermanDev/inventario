const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configurar la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Crear un producto en la tabla productos
app.post('/api/productos', (req, res) => {
    const { codigo_producto, descripcion, categoria, proveedor_id, precio_compra, precio_venta, stock_inicial, stock_actual, stock_minimo, ubicacion } = req.body;

    const sql = `INSERT INTO productos (codigo_producto, descripcion, categoria, proveedor_id, precio_compra, precio_venta, stock_inicial, stock_actual, stock_minimo, ubicacion)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [codigo_producto, descripcion, categoria, proveedor_id, precio_compra, precio_venta, stock_inicial, stock_actual || null, stock_minimo, ubicacion], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'Producto agregado', productoId: result.insertId });
    });
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const sql = `
        SELECT p.*, pr.nombre AS proveedor_nombre
        FROM productos p
        LEFT JOIN proveedores pr ON p.proveedor_id = pr.id_proveedor
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { codigo_producto, descripcion, categoria, proveedor_id, precio_compra, precio_venta, stock_inicial, stock_actual, stock_minimo, ubicacion } = req.body;

    const sql = `UPDATE productos 
                 SET codigo_producto = ?, descripcion = ?, categoria = ?, proveedor_id = ?, precio_compra = ?, precio_venta = ?, stock_inicial = ?, stock_actual = ?, stock_minimo = ?, ubicacion = ?
                 WHERE id_producto = ?`;

    db.query(sql, [codigo_producto, descripcion, categoria, proveedor_id, precio_compra, precio_venta, stock_inicial, stock_actual || null, stock_minimo, ubicacion, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'Producto actualizado' });
    });
});

// Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM productos WHERE id_producto = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'Producto eliminado' });
    });
});
// Ruta para obtener proveedores
app.get('/api/proveedores', (req, res) => {
    db.query('SELECT * FROM proveedores', (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
