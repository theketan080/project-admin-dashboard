# Product Admin Dashboard

A responsive product management dashboard built with Next.js, React, Tailwind CSS, and Axios using the DummyJSON API.

The application includes authentication, product listing, pagination, search, category filtering, sorting, product details, and CRUD operations.

---

## 🚀 Features

### Authentication

- Login using DummyJSON authentication API
- Protected product routes
- JWT/access token stored in localStorage
- Axios automatically attaches the token to API requests
- Logout functionality
- Invalid credential handling
- Prevents repeated login submissions

### Product Listing

- Responsive desktop table
- Responsive mobile card layout
- Product image
- Product title
- Category
- Price
- Rating
- Stock

### Pagination

- Server-side pagination using `limit` and `skip`
- Page numbers
- Previous / Next buttons
- Page sizes:
  - 10
  - 20
  - 50
- Displays the current result range

Example:

```text
Showing 21 – 40 of 194
````

### Search

* Product search using DummyJSON search API
* 500ms debounce
* Search resets pagination to page 1
* Search state is stored in the URL
* Previous requests are cancelled using `AbortController`

### Category Filtering

* Categories loaded from the API
* Category filtering using the DummyJSON category endpoint
* Category state stored in the URL
* Category changes reset pagination to page 1

### Sorting

Supports:

* Price: Low → High
* Price: High → Low
* Rating: Low → High
* Rating: High → Low
* Title: A → Z
* Title: Z → A

Sorting state is stored in the URL.

### Product Details

* Dynamic route: `/products/[id]`
* Product image
* Title
* Category
* Price
* Rating
* Stock
* Description
* Brand
* Reviews
* Invalid product handling

### CRUD Operations

#### Add Product

* Product creation form
* Form validation
* Prevents repeated submissions

#### Edit Product

* Existing product data is pre-filled
* Product validation
* Update functionality

#### Delete Product

* Delete confirmation modal
* Cancel deletion
* Delete loading state
* Prevents repeated delete requests

### Error & Loading Handling

* Loading states
* Empty states
* API error states
* Retry functionality
* Invalid URL parameter handling
* Centralized Axios error handling

---

## 🛠️ Tech Stack

* Next.js
* React
* JavaScript
* Tailwind CSS
* Axios
* DummyJSON API

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── login/
│   │   └── page.js
│   │
│   └── products/
│       ├── page.js
│       ├── add/
│       │   └── page.js
│       │
│       └── [id]/
│           ├── page.js
│           └── edit/
│               └── page.js
│
├── components/
│   ├── ProductTable.jsx
│   ├── ProductCards.jsx
│   └── ProductForm.jsx
│
├── lib/
│   └── axios.js
│
└── services/
    ├── auth.service.js
    └── product.service.js
```

---

## 🔌 API

The project uses the DummyJSON API.

### Base URL

```text
https://dummyjson.com
```

### Main Endpoints

```text
POST   /auth/login

GET    /products
GET    /products/search
GET    /products/categories
GET    /products/category/{category}
GET    /products/{id}

POST   /products/add
PUT    /products/{id}
DELETE /products/{id}
```

---

## 🔐 Login Credentials

Use the following DummyJSON test credentials:

```text
Username: emilys
Password: emilyspass
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

Environment files are excluded from Git using `.gitignore`.

---

## 💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/theketan080/project-admin-dashboard.git
```

### 2. Go to the project directory

```bash
cd project-admin-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env.local`

```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## 🧠 Implementation Choices

### Axios Service Layer

API calls are separated from UI components using service files.

For example:

```text
src/services/product.service.js
```

This keeps API communication separate from presentation logic.

### Shared Axios Instance

A shared Axios instance is used for all API requests.

The request interceptor automatically attaches the authentication token.

A response interceptor provides centralized API error logging.

### URL-Based State

Pagination, search, category, and sorting values are stored in URL query parameters.

Example:

```text
/products?search=phone&sortBy=price&order=asc&page=1&pageSize=10
```

This allows the current dashboard state to survive refreshes and browser navigation.

### AbortController

Search and product requests use `AbortController` so that outdated requests can be cancelled when a newer request is made.

This helps prevent stale search results from overwriting newer results.

---

## ⚠️ API Limitation

DummyJSON's search and category APIs are separate endpoints.

Because the assignment requires search and category filtering to be handled through the API endpoints, the application does not combine search and category filters.

When a category is selected while searching, the search query is cleared.

---

## 🐛 Problems & Solutions

### Search Race Conditions

Rapid search changes can create multiple API requests.

**Solution:**

Used `AbortController` to cancel previous requests when a new request starts.

### Invalid URL Parameters

Users can manually enter invalid values such as:

```text
?page=abc
?page=0
?page=999
?pageSize=25
```

**Solution:**

URL parameters are validated and normalized before being used.

### Repeated Form Submission

Users can click Save or Login multiple times.

**Solution:**

Buttons are disabled while the request is in progress.

### Invalid Product IDs

A product URL can contain an invalid ID.

**Solution:**

The application displays a dedicated Product Not Found state instead of crashing.

### CRUD Persistence

DummyJSON provides simulated CRUD operations and does not permanently persist changes to the backend.

The UI handles the API response correctly while treating the API as the source of truth.

---

## 🤖 AI Usage

AI assistance was used during development for:

* Understanding implementation approaches
* Debugging errors
* Reviewing API integration
* Improving component structure
* Writing and reviewing parts of the implementation

All generated code was reviewed, tested, and adapted during development.

The implementation and behavior of the application were manually verified.

---

## 📱 Responsive Design

The dashboard supports:

* Desktop table layout
* Mobile card layout
* Responsive product details
* Responsive forms
* Mobile-friendly navigation and controls

---

## 📄 Assignment Requirements Covered

* Authentication
* Protected routes
* Product listing
* Pagination
* Search with debounce
* Category filtering
* Sorting
* Product details
* Add product
* Edit product
* Delete product
* Validation
* Confirmation modal
* Loading states
* Empty states
* Error handling
* Retry handling
* Axios service layer
* URL state management
* Race-condition handling

---

---
## 🚀 Live Demo

[Live Demo](https://project-admin-dashboard-5bxx.onrender.com)

---

## 👨‍💻 Author

**Ketan**

B.Tech — Information Technology

GitHub:

[https://github.com/theketan080](https://github.com/theketan080)

````