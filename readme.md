# Ecommerce backend
Este proyecto brinda una posible implementación del backend de un ecommerce, que permite gestionar, registrar, modificar y eliminar productos, además de brindar al usuario la posibilidad de buscar, filtrar y agregar a su carrito los productos dados de alta en el sistema.

## Inicialización
Para inicializar el proyecto es necesario clonar el repositorio a tu sistema local. Podés hacerlo mediante el siguiente comando, desde el directorio en el que quieras clonar el proyecto:
```bash
git clone https://github.com/elgame3215/backend-1
```
Una vez tengas el proyecto en tu sistema local, deberás instalar las dependencias necesarias usando el comando `npm install` desde el directorio del repositorio. Luego de esto, el proyecto estará listo para ser levantado con el comando `npm start`

## Funcionalidades
La interfaz que brinda el proyecto se divide en tres rutas:
* [products API](#products-API)
* [carts API](#carts-API)
* [products UI](#products-UI)

### products API
La ruta /api/products permite agregar, eliminar y modificar productos de la base de datos mediante los siguientes endpoints:

```
* GET http://localhost:8080/api/products
```

Lista todos los productos dados de alta mediante paginación.
Acepta los parámetros: `limit` (limite de productos por página), `page` (numero de página a solicitar), `sort` (permite ordenar los productos por precio con "asc" o "desc"), `query` (permite filtrar los productos por la categoria que reciba).

```
* GET http://localhost:8080/api/products/:pid
```

Trae la información del producto correspondiente al id recibido por :pid, siempre que haya uno.

```
* POST http://localhost:8080/api/products
```

Permite dar de alta un nuevo producto, cuya información se incluirá en el body de la petición. Es necesario que la información del producto sea correcta de acuerdo a las restricciones.

```
* DELETE http://localhost:8080/api/products/:pid
```

Da de baja el producto correspondiente al id recibido por :pid, siempre que haya uno.

```
* PUT http://localhost:8080/api/products/:pid
```

Modifica la información del producto correspondiente al id recibido por :pid, siempre que haya uno y la nueva información, que se incluirá en el body de la petición, sea correcta de acuerdo a las restricciones.

### carts API
La ruta /api/carts permite crear, eliminar y modificar carritos de compra de la base de datos mediante los siguientes endpoints:

```
* GET http://localhost:8080/api/carts/:cid
```

Trae los productos del carrito correspondiente al id recibido por :cid, siempre que haya un carrito con ese id.

```
* POST http://localhost:8080/api/products
```

Permite dar de alta un nuevo carrito, inicialmente vacío.

```
* POST http://localhost:8080/api/carts/:cid/product/:pid
```

Agrega una unidad del producto correspondiente al id recibido por :pid al carrito con el id recibido por :cid, siempre que haya un carrito y un producto con esos id, y que el stock del producto sea mayor que la cantidad de unidades del mismo producto en el carrito.

```
* DELETE http://localhost:8080/api/carts/:cid/product/:pid
```

Elimina del carrito correspondiente al id recibido por :cid el producto con el id recibido por :pid, siempre que haya un carrito con ese id, y contenga al producto en cuestión.

```
* PUT http://localhost:8080/api/carts/:cid
```

Reemplaza la lista de productos del carrito correspondiente al id recibido por :cid por la lista recibida por el body de la petición. Siempre que haya un carrito con el id dado, un producto para cada id recibido y cada producto cuente con un stock no menor a la cantidad demandada del mismo.
El formato del body debe ser el siguiente:
``` JSON
[
	{
		"product": id,					// id del producto cuya cantidad de unidades se desea modificar
		"quantity": cantidad_de_unidades	// cantidad de unidades a establecer para el producto
	}
]
```

```
* PUT http://localhost:8080/api/carts/:cid/product/:pid
```

Modifica la cantidad de unidades del producto correspondiente al id recibido por :pid en el carrito con el id recibido por :cid, siempre y cuando exista un carrito con ese id, incluya al producto con el id dado y dicho producto cuente con un stock no menor a la cantidad demandada del mismo.

```
* DELETE http://localhost:8080/api/carts/:cid
```

Elimina todos los productos del carrito correspondiente al id recibido por :cid, siempre que haya un carrito con ese id.

### products UI
La ruta /products entrega una serie de interfaces visuales que le permiten al usuario tanto dar de alta/baja productos en el sistema, como visualizar productos y agregarlos o quitarlos de su carrito mediante los siguientes endpoints:

```
* GET http://localhost:8080/products
```

Lista todos los productos dados de alta mediante paginación.
Acepta los parámetros: `limit` (limite de productos por página), `page` (numero de página a solicitar), `sort` (permite ordenar los productos por su precio con "asc" o "desc"), `query` (permite filtrar los productos por la categoria que reciba).
Cada producto brinda la posibilidad de ser añadido al carrito del usuario, siempre que posea un stock mayor a la cantidad de unidades del mismo producto que el usuario lleva añadidos a su carrito.
También cuenta con un botón que dirige al usuario a la vista de su carrito, que es creado y asignado al usuario la primera vez que entra a la página.

```
* GET http://localhost:8080/products/realtimeproducts
```

Lista los productos dados de alta igual que el endpoint anterior, además de proveer un formulario mediante el cual se pueden dar de alta productos. Además, cada producto puede ser eliminado desde la interfaz.
También acepta los parámetros `limit`, `page`, `sort`, `query`.

```
* GET http://localhost:8080/products/carts/:cid
```

Lista únicamente los productos agregados al carrito correspondiente al id recibido por :cid, permitiendo eliminar a cada uno del carrito (no del sistema).

## Restricciones

* Todas las rutas que requieran tanto un :pid como un :cid, deben recibir como argumento en cada parámetro una cadena hexadecimal de 24 digitos.

* Para ser considerado válido, un producto debe tener el siguiente formato:
```JSON
{
		"title": "Manzanas",			// título del producto
		"description": "Manzanas rojas, 1kg",	// breve descripción del producto
		"code": "M001",				// código alfanumérico, único en el sistema
		"price": 2500,			// precio numérico del producto, no menor a cero
		"stock": 250,				// cantidad de unidades disponibles del producto, no menor a cero
		"category": "Frutas"			// categoría/clasificación del producto
}
```
