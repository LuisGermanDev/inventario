crear un usuario en mysql en mi caso luis con el password luis y crear la base de datos llamanada mi_basedatos con las siguintes tablas
+------------------------+
| Tables_in_mi_basedatos |
+------------------------+
| productos              |
| proveedores            |
+------------------------+
mysql> desc productos;
+-----------------+---------------+------+-----+---------+----------------+
| Field           | Type          | Null | Key | Default | Extra          |
+-----------------+---------------+------+-----+---------+----------------+
| id_producto     | int           | NO   | PRI | NULL    | auto_increment |
| codigo_producto | varchar(50)   | NO   |     | NULL    |                |
| descripcion     | varchar(255)  | NO   |     | NULL    |                |
| categoria       | varchar(100)  | YES  |     | NULL    |                |
| proveedor_id    | int           | YES  | MUL | NULL    |                |
| precio_compra   | decimal(10,2) | YES  |     | NULL    |                |
| precio_venta    | decimal(10,2) | YES  |     | NULL    |                |
| stock_inicial   | int           | YES  |     | NULL    |                |
| stock_actual    | int           | YES  |     | NULL    |                |
| stock_minimo    | int           | YES  |     | NULL    |                |
| ubicacion       | varchar(100)  | YES  |     | NULL    |                |
+-----------------+---------------+------+-----+---------+----------------+
mysql> desc proveedores;
+--------------+--------------+------+-----+---------+----------------+
| Field        | Type         | Null | Key | Default | Extra          |
+--------------+--------------+------+-----+---------+----------------+
| id_proveedor | int          | NO   | PRI | NULL    | auto_increment |
| nombre       | varchar(255) | NO   |     | NULL    |                |
| contacto     | varchar(100) | YES  |     | NULL    |                |
| telefono     | varchar(20)  | YES  |     | NULL    |                |
| correo       | varchar(100) | YES  |     | NULL    |                |
| direccion    | varchar(255) | YES  |     | NULL    |                |
+--------------+--------------+------+-----+---------+----------------+
