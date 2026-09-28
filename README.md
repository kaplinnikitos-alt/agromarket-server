# АгроМаркет API

Backend для учебного проекта «АгроМаркет» на Node.js + Express. Отдаёт товары каталогу и принимает оптовые заявки из React-формы. Frontend: репозиторий `agromarket-react`.

## Запуск

```
npm install
npm run dev   # http://localhost:3000
```

Запускать из папки `agromarket-server` (путь к `data/db.json` считается от неё). Нужен Node.js 18.11+ (режим `--watch`).

## Структура

```
agromarket-server/
├── data/
│   ├── db.json            # товары
│   └── products.js        # загрузка данных
├── middleware/
│   ├── logger.js          # логгер запросов
│   └── validateOrder.js   # проверка заявки (middleware маршрута)
├── routes/
│   ├── products.js        # /api/products
│   └── orders.js          # /api/orders
└── server.js              # сборка приложения
```

Порядок middleware в `server.js`: `cors` → `express.json()` → `logger` → маршруты → обработчик 404.

## Эндпоинты

| Метод | Путь                | Описание                                   | Ответы   |
|-------|---------------------|--------------------------------------------|----------|
| GET   | /api/health         | проверка сервера                           | 200      |
| GET   | /api/about          | информация о приложении                    | 200      |
| GET   | /api/products       | товары; `?search=`, `?maxPrice=`, `?sort=` | 200      |
| GET   | /api/products/:id   | один товар                                 | 200, 404 |
| GET   | /api/orders         | список заявок                              | 200      |
| POST  | /api/orders         | новая заявка                               | 201, 400 |

Примеры: `/api/products?search=мёд&maxPrice=5000`, `/api/products?sort=-price` (по убыванию цены).

Тело `POST /api/orders` (JSON): `name`, `email`, `quantity` (≥ 10) — обязательные; `phone`, `date`, `comment` — по желанию. Заявки хранятся в памяти и пропадают при перезапуске сервера.

## Лабораторная 5 — ответы

- **Content-Type у res.send и res.json:** `res.send('строка')` отдаёт `text/html; charset=utf-8`, а `res.json({...})` — `application/json; charset=utf-8`. Клиент по этому заголовку понимает, как разбирать ответ.
- **Что происходит без next() в middleware:** запрос не передаётся дальше по цепочке, а сам middleware ответ не отправляет, поэтому страница «висит» и ждёт ответа до таймаута. Маршрут не выполняется.
- **Логгер после маршрутов:** запросы к `/api/products` не логируются. Маршрут отвечает сам и не вызывает `next()`, поэтому запрос до логгера не доходит. Порядок `app.use()` — это порядок звеньев конвейера.
- **Отправка формы без express.json():** `req.body` остаётся `undefined`, сервер не видит полей и возвращает 400 «Поля name, email и quantity обязательны», хотя форма заполнена верно.
- **Использовал(а) ли ИИ и для чего:** да, использовал(а) ИИ (Claude) для написания и проверки кода сервера, доработки формы и оформления README; работу запустил(а) и проверил(а) сам(а).

## Вопросы для защиты (кратко)

- **json-server и Express:** json-server — готовый сервер по db.json без своей логики; в Express маршруты, проверки и middleware пишем сами.
- **req.params и req.query:** `req.params.id` — часть пути (`/api/products/2`), `req.query.search` — строка запроса (`/api/products?search=мёд`).
- **Коды:** 200 — успех (все GET), 201 — заявка создана (POST /api/orders), 400 — неверные данные (POST /api/orders), 404 — товар или маршрут не найден.
- **CORS:** `localhost:5173` и `localhost:3000` — разные источники (разный порт), поэтому браузер блокирует чтение ответа, пока сервер не разрешит через `Access-Control-Allow-Origin` (`cors()`).
