# RESTful API Structure and Design

A well-designed API follows consistent patterns that make it intuitive and easy to use. Good API design is crucial for developer experience and long-term maintainability.

### Design Considerations:

- **Resource Naming**: Use nouns, not verbs (e.g., `/users` not `/getUsers`)
- **Pluralization**: Use plural for collections (`/users/123` not `/user/123`)
- **Hierarchy**: Nest resources to show relationships (`/users/123/orders`)
- **Filtering/Sorting**: Use query parameters for optional operations
- **Versioning Strategy**: Plan for API versioning from the start (e.g., `/v1/users` vs `/v2/users`).

### A well-structured API follows these conventions:

- **Use nouns for resources**: `/users`, `/products`, `/orders` (not `/getUsers`)
- **Use plurals for collections**: `/users` instead of `/user`
- **Nest resources for relationships**: `/users/123/orders`
- **Use query parameters for filtering**: `/products?category=electronics&min_price=100`
Keep URLs consistent: Choose a convention (kebab-case, camelCase) and stick to it

## Example
```js
// Good API structure
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);
app.get('/api/products/:id/reviews', getProductReviews);
app.get('/api/users/:userId/orders', getUserOrders);
app.post('/api/orders', createOrder);

// Filtering and pagination
app.get('/api/products?category=electronics&sort=price&limit=10&page=2');
```
