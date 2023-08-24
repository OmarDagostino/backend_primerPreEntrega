import express from 'express';
import fs from 'fs';

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

const cartsPath = './carrito.json';
const productsPath = './productos.json';

// Función para leer un archivo JSON
const readJSONFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);}
  } catch (error) {
    return [error];
  }
};

// Función para escribir en un archivo JSON
const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// *********************************************************************
// *                     Rutas para carritos                           *
// *********************************************************************

  // GET para retornar un carrito x su ID

  router.get('/carts/:cid', (req, res) => {
    const carts = readJSONFile(cartsPath);
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id == cartId);
    res.setHeader('Content-Type','application/json');
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

    if (req.params.cid !== "" && isNaN(cartId)) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ error: 'El parámetro cid debe ser un número válido o estar vacío' });
      return;
    }

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
    
          
        const products = readJSONFile(productsPath);
        const product = products.find(p => p.id == productId);
    
        // Verificar si el producto existe en products.json
        if (!product) {
        res.setHeader('Content-Type','application/json');
        res.status(404).send('Producto no encontrado');
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

        const existingProduct = cart.products.find(p => p.product == productId);
    
        if (existingProduct) {
        existingProduct.quantity += quantity;
        } else {
        cart.products.push({ product: productId, quantity });
        }
  
        writeJSONFile(cartsPath, carts);

        res.setHeader('Content-Type','application/json');
        res.status(201).json(cart);
    });
   
export default router;
