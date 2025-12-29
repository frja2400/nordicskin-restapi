const Product = require('../models/product');

// Hämta alla produkter
exports.getAllProducts = async (request, h) => {
    try {
        // Hämtar query-parametrarna från URL:en
        const { search, category, sort } = request.query;

        // Bygger query-objekt
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        // Bygg query med sort
        let productsQuery = Product.find(query);
        if (sort) {
            productsQuery = productsQuery.sort({ [sort]: 1 }); // 1 = stigande
        }

        // Kör queryn mot databasen och hämtar resultaten
        const products = await productsQuery;

        return h.response({ products }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Could not fetch products' }).code(500);
    }
};

// Hämta produkt med specifikt id
exports.getProductById = async (request, h) => {
    try {
        // Hämta id från routens parametrar
        const { id } = request.params;
        // Hämta produkten från databasen
        const product = await Product.findById(id);

        if (!product) {
            return h.response({ error: 'Product not found' }).code(404);
        }
        return h.response({ product }).code(200);
    } catch (error) {
        return h.response({ error: 'Could not fetch product' }).code(500);
    }
};

// Lägg till produkt
exports.addProduct = async (request, h) => {
    try {
        // Skapa en ny instans med payload
        const product = new Product(request.payload);
        // Spara instansen i databasen
        const savedProduct = await product.save();

        return h.response({ product: savedProduct }).code(201);
    } catch (error) {
        return h.response({ error: 'Could not add product' }).code(500);
    }
};

// Uppdatera produkt med specifikt id
exports.updateProductById = async (request, h) => {
    try {
        const { id } = request.params;
        // Hämta data att uppdatera från payload
        const updateData = request.payload;

        // Hitta och uppdatera produkten med data från request.payload och returnera den uppdaterade produkten
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return h.response({ error: 'Product not found' }).code(404);
        }
        return h.response({ product: updatedProduct }).code(200);
    } catch (error) {
        return h.response({ error: 'Could not update product' }).code(500);
    }
};

// Ta bort produkt med specifikt id
exports.deleteProductById = async (request, h) => {
    try {
        const { id } = request.params;
        const deleteProduct = await Product.findByIdAndDelete(id);

        if (!deleteProduct) {
            return h.response({ error: 'Product not found' }).code(404);
        }

        return h.response({ product: deleteProduct }).code(200);
    } catch (error) {
        return h.response({ error: 'Could not delete product' }).code(500);
    }
};

// Justera lagersaldo med enkel öka/minska funktion.
exports.updateProductStock = async (request, h) => {
    try {
        const { id } = request.params;
        const { amount } = request.payload;

        // Hämta produkten
        const product = await Product.findById(id);
        if (!product) {
            return h.response({ error: 'Product not found' }).code(404);
        }

        // Justera stock
        const newStock = product.stock + amount;
        if (newStock < 0) {
            return h.response({ error: 'Stock cannot be negative' }).code(400);
        }
        product.stock = newStock;

        // Spara ändringen
        const updatedProduct = await product.save();

        return h.response({ product: updatedProduct }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Could not update product stock' }).code(500);
    }
};