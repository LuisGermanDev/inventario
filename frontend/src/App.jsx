import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [codigoProducto, setCodigoProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [proveedorNombre, setProveedorNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stockInicial, setStockInicial] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Obtener los productos y proveedores cuando cargue la página
  useEffect(() => {
    fetch("http://localhost:5000/api/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:5000/api/proveedores")
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error("Error fetching proveedores:", error));
  }, []); // Agregar array de dependencias vacío para que solo se ejecute una vez al montar el componente

  // Función para agregar o actualizar un producto
  const agregarOActualizarProducto = (e) => {
    e.preventDefault();

    const nuevoProducto = {
      codigo_producto: codigoProducto,
      descripcion,
      categoria,
      proveedor_id: proveedorId,
      precio_compra: parseFloat(precioCompra),
      precio_venta: parseFloat(precioVenta),
      stock_inicial: parseInt(stockInicial, 10),
      stock_actual: stockActual ? parseInt(stockActual, 10) : null,
      stock_minimo: parseInt(stockMinimo, 10),
      ubicacion,
    };

    if (productoSeleccionado) {
      // Actualizar el producto
      fetch(
        `http://localhost:5000/api/productos/${productoSeleccionado.id_producto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoProducto),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Buscar el nombre del proveedor actualizado
          const proveedorActualizado = proveedores.find(
            (proveedor) => proveedor.id_proveedor === proveedorId
          );

          // Actualizar el producto con los datos nuevos, incluyendo el nombre del proveedor
          const productosActualizados = productos.map((producto) =>
            producto.id_producto === productoSeleccionado.id_producto
              ? {
                  ...producto,
                  ...nuevoProducto,
                  proveedor_nombre: proveedorActualizado
                    ? proveedorActualizado.nombre
                    : producto.proveedor_nombre,
                }
              : producto
          );

          setProductos(productosActualizados);
          setProductoSeleccionado(null); // Limpiar la selección después de actualizar
        })
        .catch((error) => console.error("Error updating product:", error));
    } else {
      // Agregar nuevo producto
      fetch("http://localhost:5000/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      })
        .then((response) => response.json())
        .then((data) => {
          const proveedorActualizado = proveedores.find(
            (proveedor) => proveedor.id_proveedor === proveedorId
          );

          // Añadir el nuevo producto con el nombre del proveedor
          setProductos([
            ...productos,
            {
              ...nuevoProducto,
              id_producto: data.id_producto,
              proveedor_nombre: proveedorActualizado
                ? proveedorActualizado.nombre
                : "",
            },
          ]);
        })
        .catch((error) => console.error("Error adding product:", error));
    }

    limpiarFormulario();
  };

  // Función para eliminar un producto
  const eliminarProducto = () => {
    if (productoSeleccionado) {
      fetch(
        `http://localhost:5000/api/productos/${productoSeleccionado.id_producto}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const productosActualizados = productos.filter(
            (producto) =>
              producto.id_producto !== productoSeleccionado.id_producto
          );
          setProductos(productosActualizados);
          limpiarFormulario();
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  // Función para cancelar la edición del producto
  const cancelarEdicion = () => {
    limpiarFormulario();
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setCodigoProducto("");
    setDescripcion("");
    setCategoria("");
    setProveedorId("");
    setProveedorNombre("");
    setPrecioCompra("");
    setPrecioVenta("");
    setStockInicial("");
    setStockActual("");
    setStockMinimo("");
    setUbicacion("");
    setProductoSeleccionado(null);
  };

  // Función para abrir la modal de selección de proveedores
  const abrirModal = () => {
    setModalVisible(true);
  };

  // Función para cerrar la modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // Función para seleccionar un proveedor desde la modal
  const seleccionarProveedor = (proveedor) => {
    setProveedorId(proveedor.id_proveedor);
    setProveedorNombre(proveedor.nombre);
    setModalVisible(false);
  };

  // Función para seleccionar un producto y rellenar el formulario
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCodigoProducto(producto.codigo_producto);
    setDescripcion(producto.descripcion);
    setCategoria(producto.categoria);
    setProveedorId(producto.proveedor_id); // Asegúrate de que este campo esté disponible
    setProveedorNombre(producto.proveedor_nombre); // Mostrar el nombre del proveedor
    setPrecioCompra(producto.precio_compra);
    setPrecioVenta(producto.precio_venta);
    setStockInicial(producto.stock_inicial || "");
    setStockActual(producto.stock_actual || "");
    setStockMinimo(producto.stock_minimo || "");
    setUbicacion(producto.ubicacion || "");
  };

  // Filtrar los productos en función del término de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para manejar el clic fuera de la modal para cerrarla
  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal")) {
      cerrarModal();
    }
  };

  return (
    <div className="App">
      <h1>INVENTARIO</h1>

      <h2>
        {productoSeleccionado ? "Actualizar Producto" : "Agregar Producto"}
      </h2>

      <form onSubmit={agregarOActualizarProducto}>
        <div>
          <input
            value={codigoProducto}
            onChange={(e) => setCodigoProducto(e.target.value.toUpperCase())}
            placeholder="Código Producto"
            required
          />
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
            placeholder="Descripción"
            required
          />
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value.toUpperCase())}
            placeholder="Categoría"
          />
          <input
            required
            value={precioCompra}
            onChange={(e) => setPrecioCompra(e.target.value)}
            placeholder="Precio de Compra"
            type="number"
          />
          <input
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            placeholder="Precio de Venta"
            type="number"
            required
          />
          <input
            value={stockInicial}
            onChange={(e) => setStockInicial(e.target.value)}
            placeholder="Stock Inicial"
            type="number"
          />
          <input
            value={stockActual}
            onChange={(e) => setStockActual(e.target.value)}
            placeholder="Stock Actual (opcional)"
            type="number"
          />
          <input
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            placeholder="Stock Mínimo"
            type="number"
          />
          <input
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value.toUpperCase())}
            placeholder="Ubicación"
          />

          <button className="Proveedor" type="button" onClick={abrirModal}>
            <div className="botonp">
              <div>Proveedor</div>{" "}
              <div>{proveedorNombre && <p> {proveedorNombre}</p>}</div>
            </div>
          </button>
          <div className="Botones">
            {!productoSeleccionado ? (
              <button type="submit">Guardar</button>
            ) : (
              <>
                <button type="submit">Actualizar</button>
                <button type="button" onClick={eliminarProducto}>
                  Eliminar
                </button>
                <button type="button" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      <div className="Busqueda">
        <h2>Búsqueda:</h2>
        <input
          type="text"
          placeholder="Buscar por descripción"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <h2>Inventario de Productos</h2>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Stock Inicial</th>
            <th>Stock Actual</th>
            <th>Stock Mínimo</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr
              key={producto.id_producto}
              onClick={() => seleccionarProducto(producto)}
            >
              <td>{producto.codigo_producto}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.categoria}</td>
              <td>{producto.proveedor_nombre}</td>
              <td>{producto.precio_compra}</td>
              <td>{producto.precio_venta}</td>
              <td>{producto.stock_inicial || "SIN S. INICIAL"}</td>
              <td>{producto.stock_actual || "Sin stock"}</td>
              <td>{producto.stock_minimo || "SIN S. MIN"}</td>
              <td>{producto.ubicacion || "SIN ALMACEN"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de selección de proveedores */}
      {modalVisible && (
        <div className="modal" onClick={handleClickOutside}>
          <div className="modal-content">
            <h2>Seleccionar Proveedor</h2>
            <ul>
              {proveedores.map((proveedor) => (
                <li
                  key={proveedor.id_proveedor}
                  onClick={() => seleccionarProveedor(proveedor)}
                >
                  {proveedor.nombre} {proveedor.contacto}
                </li>
              ))}
            </ul>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
