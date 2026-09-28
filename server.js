import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';

const app = express();
const PORT = 3000;

// ВПИШИТЕ СВОЁ ФИО (используется в /api/about)
const AUTHOR = 'Каплин Никита Сергеевич';

// Конвейер middleware: cors -> json -> logger -> маршруты -> 404
app.use(cors({ origin: 'http://localhost:5173' })); // разрешаем только наш frontend
app.use(express.json()); // тело запроса -> req.body
app.use(logger);

app.get('/', (req, res) => {
  res.send('АгроМаркет API работает');
});

// «Жив ли сервер?»
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/about', (req, res) => {
  res.json({ name: 'АгроМаркет', version: '1.0', author: AUTHOR });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Сюда доходят только запросы, которые не обработал ни один маршрут
app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.listen(PORT, () => {
  console.log(`API запущен: http://localhost:${PORT}`);
});
