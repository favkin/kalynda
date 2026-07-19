# KALYNDA — Backend API

Express + MongoDB (Mongoose) API for the KALYNDA product catalog, with admin authentication and Cloudinary media uploads.

## Tech stack

- Express
- MongoDB with Mongoose
- JWT authentication
- Cloudinary (image/video storage) via Multer

## Project structure

```
app.js                         — entry point, mounts routes, connects DB
controller/
  adminController.js           — register, login
  productController.js         — create, read, update, delete products
middleware/
  auth.js                      — verifies JWT, sets req.user
  role.js                      — restricts routes by admin role
  cloudinaryUpload.js          — Multer + Cloudinary storage config
model/
  admin.js                     — Admin schema
  product.js                   — Product schema
route/
  adminRoute.js                — /api/admin/*
  productRoute.js               — /api/product/*
utils/
  cloudinary.js                — Cloudinary SDK config
  db.js                        — MongoDB connection
  generateToken.js             — JWT signing
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the project root:
   ```
   PORT=4040
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   - `MONGO_URI` — from MongoDB Atlas (Connect → Drivers).
   - `CLOUDINARY_*` — from your Cloudinary dashboard's Account Details page.
   - `JWT_SECRET` — any long random string.

3. Start the server:
   ```
   node app.js
   ```
   Runs on `http://localhost:4040` by default (or whatever `PORT` is set to).

## API endpoints

### Admin — `/api/admin`

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/register` | — | `name, phone, password, role` |
| POST | `/login` | — | `name, password` → returns `{ token, admin }` |

### Products — `/api/product`

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/newProduct` | Bearer token | multipart form: `name, price, description, stock, auto` (file field) |
| GET | `/allProducts` | — | — |
| GET | `/singleProduct/:id` | — | — |
| PATCH | `/updateSingle/:id` | Bearer token | `name, price, description, stock` (JSON — no file support) |
| DELETE | `/deleteSingle/:id` | Bearer token | — |

Authenticated requests need an `Authorization: Bearer <token>` header, using the token returned from `/login`.

## Known fixes applied during development

These were bugs found and fixed while building this out — noting them here so they don't get silently reintroduced:

1. **`generateToken` was hardcoding `role: 'Admin'`** regardless of the admin's actual role in the database, which broke any role-based access checks. Fixed to accept and sign the real role: `generateToken(admin._id, admin.role)`.

2. **Middleware order on protected routes** — `roleMiddileware` must run *after* `authMiddleware`, since it depends on `req.user` being set. Correct order:
   ```javascript
   router.post('/newProduct', upload.single('auto'), authMiddleware, roleMiddileware('admin'), createNewProduct);
   ```

3. **`media` field shape mismatch** — the `Product` schema defines `media` as an array of `{ url, publicId, type }`, but the controller was saving a plain string, which throws a Mongoose `ObjectParameterError`. Fixed to save it as an array:
   ```javascript
   media: [{ url: req.file.path, publicId: req.file.filename, type: mediaType }]
   ```

## Known limitations (not yet fixed)

- **`updateSingle` doesn't support replacing the uploaded file** — it only updates text fields (`name, price, description, stock`). Adding file support would mean applying `upload.single('auto')` to that route too and updating the `media` array in the controller.
- **CORS is fully open** (`app.use(cors())`) — fine for development, but worth restricting to your actual frontend domain once deployed.

## Deployment notes (Render)

- Root directory: this backend folder.
- Build command: `npm install`
- Start command: `node app.js`
- Add all the `.env` variables above as environment variables in Render's dashboard — Render doesn't read your local `.env` file.
- Free tier web services spin down after 15 minutes of inactivity and take 30–60 seconds to wake back up on the next request — expected behavior, not a bug.
