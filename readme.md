# Ecommerce backend

Este proyecto brinda una posible implementación del backend de un ecommerce, que permite gestionar, registrar, modificar y eliminar productos, además de brindar al usuario la posibilidad de buscar, filtrar y agregar a su carrito los productos dados de alta en el sistema.

## Inicialización

Para inicializar el proyecto es necesario clonar el repositorio a tu sistema local. Podés hacerlo mediante el siguiente comando, desde el directorio en el que quieras clonar el proyecto:

```bash
git clone https://github.com/elgame3215/backend-2
```

Una vez tengas el proyecto en tu sistema local, deberás instalar las dependencias necesarias usando el comando `npm install` desde el directorio del repositorio. Luego de esto, el proyecto estará listo para ser levantado con el comando `npm start`. El programa se alojará en el puerto 8080, por lo que es necesario que dicho puerto se encuentre libre al momento de levantar el proyecto.

## Funcionalidades

La interfaz que brinda el proyecto se divide las siguientes rutas:

- [Products API](#Products-API)
- [Carts API](#Carts-API)
- [Users API](#Users-API)
- [Products UI](#Products-UI)

### Products API

La ruta /api/products permite agregar, eliminar y modificar productos de la base de datos mediante los siguientes endpoints:

```
GET /api/products
```

Lista todos los productos dados de alta mediante paginación.
Acepta los parámetros: `limit` (limite de productos por página), `page` (numero de página a solicitar), `sort` (permite ordenar los productos por precio con "asc" o "desc"), `query` (permite filtrar los productos por la categoria que reciba).

---

```
GET /api/products/:pid
```

Trae la información del producto correspondiente al id recibido por :pid, siempre que haya uno.

---

```
POST /api/products
```

Permite dar de alta un nuevo producto, cuya información se incluirá en el body de la petición.
Para ser considerado válido, un producto debe tener el siguiente formato:

```JS
{
	title: "Manzanas",			// título del producto
	description: "Manzanas rojas, 1kg",	// breve descripción del producto
	code: "M001",				// código alfanumérico, único en el sistema
	price: 2500,				// precio numérico del producto, no menor a cero
	stock: 250,				// cantidad de unidades disponibles del producto, no menor a cero
	category: "Frutas"			// categoría/clasificación del producto
}
```

---

```
DELETE /api/products/:pid
```

Da de baja el producto correspondiente al id recibido por :pid, siempre que haya uno.

---

```
PUT /api/products/:pid
```

Modifica la información del producto correspondiente al id recibido por :pid, siempre que haya uno y la nueva información, que se incluirá en el body de la petición, sea correcta de acuerdo a las [restricciones](#restricciones).

### Carts API

La ruta /api/carts permite crear, eliminar y modificar carritos de compra de la base de datos mediante los siguientes endpoints:

```
GET /api/carts/:cid
```

Trae los productos del carrito correspondiente al id recibido por :cid, siempre que haya un carrito con ese id.

---

```
POST /api/products
```

Permite dar de alta un nuevo carrito, inicialmente vacío.

---

```
POST /api/carts/mycart/product/:pid
```

Agrega una unidad del producto correspondiente al id recibido por :pid al carrito correspondiente al usuario autenticado, siempre que haya un carrito y un producto con esos id, y que el stock del producto sea mayor que la cantidad de unidades del mismo producto en el carrito.

---

```
DELETE /api/carts/mycart/product/:pid
```

Elimina del carrito correspondiente al usuario autenticado el producto con el id recibido por :pid, siempre que el carrito contenga al producto en cuestión.

---

```
PUT /api/carts/:cid
```

Reemplaza la lista de productos del carrito correspondiente al id recibido por :cid por la lista recibida por el body de la petición. Siempre que haya un carrito con el id dado, un producto para cada id recibido y cada producto cuente con un stock no menor a la cantidad demandada del mismo.
El formato del body debe ser el siguiente:

```JS
[
	{
		product: id,			// id del producto cuya cantidad de unidades se desea modificar
		quantity: cantidad_de_unidades	// cantidad de unidades a establecer para el producto
	}
]
```

---

```
PUT /api/carts/:cid/product/:pid
```

Modifica la cantidad de unidades del producto correspondiente al id recibido por :pid en el carrito con el id recibido por :cid, siempre y cuando exista un carrito con ese id, incluya al producto con el id dado y dicho producto cuente con un stock no menor a la cantidad demandada del mismo.

---

```
DELETE /api/carts/:cid
```

Elimina todos los productos del carrito correspondiente al id recibido por :cid, siempre que haya un carrito con ese id.

### Users API

La ruta api/sessions permite dar de alta usuarios, procesar logins usando JWT y recuperar información de los usuarios mediante los siguientes endpoints:

```
POST api/sessions/login
```

Inicia sesión en el dispositivo del cliente mediante JWT. Espera las credenciales del usuario en el cuerpo de la petición en el siguiente formato:

```JS
[
	{
		email: 'johndoe@example.com',
		password: 'password'
	}
]
```

---

```
POST api/sessions/register
```

Da de alta al usuario, cuyas credenciales se esperan en el cuerpo de la petición en el siguiente formato:

```JS
[
	{
		firstName: 'John',
		lastName: 'Doe',
		dateBirth: '09-12-2018',
		email: 'johndoe@example.com',
		password: 'password'
	}
]
```

La `password` se almacena hasheada usando bcrypt.

El `email` no puede estar asociado a ningun usuario previamente registrado en el sistema.

---

```
POST api/sessions/logout
```

Cierra la sesión del cliente, eliminando el JWT de sus cookies. A pesar de esto, el token puede seguir siendo usado si fue extraído previo a cerrar la sesión.

---

```
GET api/sessions/github
```

Inicia el proceso de autenticación con Github. Solicita los permisos:

- `perfil`: lectura y escritura.
- `emails`: lectura.

### products UI

La ruta /products entrega una serie de interfaces visuales que le permiten al usuario tanto dar de alta/baja productos en el sistema, como visualizar productos y agregarlos o quitarlos de su carrito mediante los siguientes endpoints:

```
GET /products
```

Lista todos los productos dados de alta mediante paginación.
Acepta los parámetros: `limit` (limite de productos por página), `page` (numero de página a solicitar), `sort` (permite ordenar los productos por su precio con "asc" o "desc"), `query` (permite filtrar los productos por la categoria que reciba).
Cada producto brinda la posibilidad de ser añadido al carrito del usuario, siempre que posea un stock mayor a la cantidad de unidades del mismo producto que el usuario lleva añadidos a su carrito.
También cuenta con un botón que dirige al usuario a la vista de su carrito, que es creado y asignado al usuario la primera vez que entra a la página.

---

```
GET /realtimeproducts
```

Lista los productos dados de alta igual que el endpoint anterior, además de proveer un formulario mediante el cual se pueden dar de alta productos. Además, cada producto puede ser eliminado del sistema desde la interfaz.
También acepta los parámetros `limit`, `page`, `sort`, `query`.

---

```
GET /mycart
```

Lista únicamente los productos agregados al carrito correspondiente al usuario que solicita la vista, permitiendo eliminar a cada uno del carrito (no del sistema).
