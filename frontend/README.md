# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    proveedor_id INT,
    precio_compra DECIMAL(10, 2),
    precio_venta DECIMAL(10, 2),
    stock_inicial INT,
    stock_actual INT,
    stock_minimo INT,
    ubicacion VARCHAR(100),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id_proveedor)
);
CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255)
);
CREATE TABLE salidas (
    id_salida INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    id_producto INT,
    cantidad_saliente INT,
    precio_venta DECIMAL(10, 2),
    ingreso_total DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad_saliente * precio_venta) STORED,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);
CREATE TABLE entradas (
    id_entrada INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    id_producto INT,
    cantidad_entrante INT,
    precio_unitario DECIMAL(10, 2),
    costo_total DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad_entrante * precio_unitario) STORED,
    proveedor_id INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id_proveedor)
);
SELECT p.descripcion, 
       p.stock_inicial, 
       IFNULL(SUM(e.cantidad_entrante), 0) AS total_entradas,
       IFNULL(SUM(s.cantidad_saliente), 0) AS total_salidas,
       (p.stock_inicial + IFNULL(SUM(e.cantidad_entrante), 0) - IFNULL(SUM(s.cantidad_saliente), 0)) AS stock_actual
FROM productos p
LEFT JOIN entradas e ON p.id_producto = e.id_producto
LEFT JOIN salidas s ON p.id_producto = s.id_producto
GROUP BY p.id_producto;
