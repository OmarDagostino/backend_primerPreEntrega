# Primer pre-entrega del curso de Programación Back-end
# Comisión 55565  de CoderHouse

## Autor : Omar D'Agostino

## Tecnologías utilizadas : 
- Node JS (con su sistema de archivos fs)
- Dependencias 
    - express
    - body-parser
    - express-validator

## Funcionalidades 

- El servidor app.js escucha peticiones en el puerto 8080.

- El enrutador users-router.js (llamado por app.js) posee los siguientes servicios en las siguientes rutas 
    * Para Productos (api/products)
        + __GET__ = devuelve los objetos de los productos solicitados (todos o por id), en el caso de todos, se puede limitar la cantidad de productos solicitar por medio del parametro ? limit , en cuyo caso solo devolcera desde el principio hasta la cantidad solicitada. Si el id solicitado no existe, devuelve el error correspondiente
        + __POST__ = crea el producto con los datos enviados en el body de la requisición, siempre y cuando esten todos los datos requeridos con sus formatos pertienentes (caso contrario da un error explicando el motivo del rechazo). El id del producto es generado automaticamente a partir del ultimo elemento del rray de productos. Si el campo status no es false (o no es informado), graba el valor por defecto true.
        + __PUT__ = actualiza el contenido del producto requerido (si no existe devuelve un mensaje de error), solo los campos informados en el body del mensaje, siempre y cuando tengan el formato correcto (caso contrario devuelve el error correpondiente)
        + __DELETE__ = borrar el producto cuya id fue informada por parametro (si no existiera , devuelve el mensaje de error correpondiente)
    * Para Carritos de compra (api/carts)
        + __GET__ = devuelve el objeto de la id del carrito solicitado (si no existiera, devuelve el mensaje de error correspondiente)
        + __POST__ = graba un registro en el carrito de compras con el id del producto informado (siempre y cuando exista en el archivo de productos) con cantidad en 1. Se genera la id del carrito automaticamente a partir de la id del último elemento del archivo de carritos. Si se informa id de carrito, busca el correpondiente (en caso de no encontrarlo devuelve el error acorde), si esta todo ok , agrega el id del producto informado (siempra y cuando exista, sino devuelve un error), si el id del producto informado ya existe en el carrito, le agrega un 1 a la cantidad pre-existente en el archivo.

- El archivo de productos se llama productos.json, y el archivo de carritos se llama carrito.json. Ambaos de crean (si no estan creados) en la misma ruta de la app.js.