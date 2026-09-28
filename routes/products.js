import { Router } from 'express';
import { products } from '../data/products.js';

const router = Router();

// Пути — ОТНОСИТЕЛЬНО точки подключения роутера:
// '/'    -> /api/products
// '/:id' -> /api/products/:id

// GET /api/products?search=мёд&maxPrice=5000&sort=-price
router.get('/', (req, res) => {
  const search = (req.query.search || '').toLowerCase();
  const maxPrice = Number(req.query.maxPrice);
  const sort = req.query.sort;

  // Поиск по названию без учёта регистра (пустая строка подходит всем)
  let result = products.filter((p) => p.name.toLowerCase().includes(search));

  // Бонус: фильтр по цене (работает вместе с search)
  if (req.query.maxPrice !== undefined && !Number.isNaN(maxPrice)) {
    result = result.filter((p) => p.price <= maxPrice);
  }

  // Бонус: сортировка. Копируем массив — .sort() меняет исходный
  if (sort === 'price') {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sort === '-price') {
    result = [...result].sort((a, b) => b.price - a.price);
  }

  res.json(result);
});

// GET /api/products/2
router.get('/:id', (req, res) => {
  const product = products.find((p) => String(p.id) === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.json(product);
});

export default router;
