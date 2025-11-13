exports.getProducts = (req, res) => {
    res.json({ message: 'Returning list of products' });
}

exports.getProductById = (req, res) => {
    const productId = req.params.id;
    res.json({ message: `Returning product with ID ${productId}` });
}

exports.createProduct = (req, res) => {
    const newProduct = req.body;
    res.json({ message: 'Product created', product: newProduct });
}

exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    res.json({ message: `Product with ID ${productId} updated`, product: updatedProduct });
}

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    res.json({ message: `Product with ID ${productId} deleted` });
}