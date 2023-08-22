import express from 'express';
import fs from 'fs';
import { body, validationResult } from 'express-validator';

// validaciones de los datos de los productos nuevos

const validateAddProduct = [
    body('title').notEmpty().isString(),
    body('description').notEmpty().isString(),
    body('code').notEmpty().isString(),
    body('price').notEmpty().isNumeric(),
    body('stock').notEmpty().isNumeric(),
    body('category').notEmpty().isString(),
    body('status').optional().isBoolean(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];

// Validaciones de las datos de los productos a actualizar
  
  const validateUpdateProduct = [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('code').optional().isString(),
    body('price').optional().isNumeric(),
    body('stock').optional().isNumeric(),
    body('category').optional().isString(),
    body('status').optional().isBoolean(),
     (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];

// generacion de la ultima id 

  const getLastId = (items) => {
    if (items.length === 0) {
      return 1;
    }
    const lastItem = items[items.length - 1];
    return lastItem.id + 1;
  };

// const de router y paths

const router = express.Router();

const productsPath = './productos.json';
const cartsPath = './carrito.json';

// Función para leer un archivo JSON
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Función para escribir en un archivo JSON
const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
// ****************************************************************************
// *                          Rutas para productos                            *
// ****************************************************************************

// GET para retornar varios productos o todos

router.get('/products', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = readJSONFile(productsPath);

  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

// GET para retornar un producto x su ID

router.get('/products/:pid', (req, res) => {
  const products = readJSONFile(productsPath);
  const product = products.find(p => p.id == req.params.pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// POST para crear un producto nuevo

router.post('/products',validateAddProduct ,(req, res) => {
  const products = readJSONFile(productsPath);
  const newProduct = req.body;
  newProduct.id = getLastId(products);
  if (newProduct.status!=false) {newProduct.status=true};
  products.push(newProduct);
  writeJSONFile(productsPath, products);

  res.status(201).json(newProduct);
});

// PUT para actualizar un producto 

router.put('/products/:pid', validateUpdateProduct, (req, res) => {
  const products = readJSONFile(productsPath);
  const productId = req.params.pid;
  const updatedProduct = req.body;

  const index = products.findIndex(p => p.id == productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    writeJSONFile(productsPath, products);
    res.json(products[index]);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// DELETE para borrar un producto

router.delete('/products/:pid', (req, res) => {
  const products = readJSONFile(productsPath);
  const productId = req.params.pid;
  const index = products.findIndex(p => p.id == productId);
  if (index !== -1) {
  const filteredProducts = products.filter(p => p.id != productId);
  writeJSONFile(productsPath, filteredProducts);

  res.send(`Producto con ID ${productId} eliminado`);}
  else {
        res.status(404).send('Producto no encontrado');}
});

// *********************************************************************
// *                     Rutas para carritos                           *
// *********************************************************************

  // GET para retornar un carrito x su ID

  router.get('/carts/:cid', (req, res) => {
    const carts = readJSONFile(cartsPath);
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id == cartId);
  
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  });

  // POST para crear un carrito nuevo o agregar un producto a un carrito existente

  router.post('/carts/:cid/product/:pid', (req, res) => {
    const carts = readJSONFile(cartsPath);
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = 1;
  
    let cart = null;

    if (cartId) {
        cart = carts.find(c => c.id == cartId);
    
        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }
      }
    
      if (!cart && cartId) {
        res.status(404).send('Carrito no encontrado');
        return;
      }
      
        // Si no se proporciona 'cid'  se crea uno nuevo
        if (!cart) {
        cart = {
            id: getLastId(carts),
            products: []
        };
        carts.push(cart);
        }
    
        const products = readJSONFile(productsPath);
        const product = products.find(p => p.id == productId);
    
        // Verificar si el producto existe en products.json
        if (!product) {
        res.status(404).send('Producto no encontrado');
        return;
        }
  
        const existingProduct = cart.products.find(p => p.product == productId);
    
        if (existingProduct) {
        existingProduct.quantity += quantity;
        } else {
        cart.products.push({ product: productId, quantity });
        }
  
        writeJSONFile(cartsPath, carts);
    
        res.status(201).json(cart);
    });
   
export default router;
