# Bootstrap TypeScript Service

A modern web service built with TypeScript, Express.js, SQLite database, and Bootstrap 5. This application provides a complete CRUD (Create, Read, Update, Delete) interface for managing users and products with a beautiful, responsive frontend.

## Features

- **TypeScript Backend**: Full TypeScript implementation with Express.js
- **SQLite Database**: Lightweight, file-based database with automatic initialization
- **Bootstrap 5 Frontend**: Modern, responsive UI with Bootstrap components
- **RESTful API**: Complete CRUD operations for users and products
- **Real-time Updates**: Dynamic content updates without page refresh
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Helmet.js for security headers, CORS support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bootstrap-typescript-service
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests (placeholder for future test implementation)

## Project Structure

```
├── src/
│   ├── server.ts              # Main server file
│   ├── database/
│   │   └── database.ts        # Database initialization and management
│   └── routes/
│       ├── userRoutes.ts      # User API endpoints
│       └── productRoutes.ts   # Product API endpoints
├── public/
│   ├── index.html             # Main HTML page
│   └── js/
│       └── app.js             # Frontend JavaScript
├── data/
│   └── app.db                 # SQLite database file (auto-generated)
├── dist/                      # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Users API

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products API

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Get products by category

### Health Check

- `GET /health` - Server health status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Tables**: Sortable and searchable data tables
- **Modal Forms**: Clean, user-friendly forms for adding/editing data
- **Real-time Updates**: Automatic refresh of data after operations
- **Toast Notifications**: User feedback for all operations
- **Smooth Scrolling**: Enhanced navigation experience
- **Bootstrap Icons**: Beautiful iconography throughout the interface

## Development

### Adding New Features

1. **New API Endpoints**: Add routes in the appropriate route file
2. **Database Changes**: Modify the database schema in `database.ts`
3. **Frontend Updates**: Update HTML and JavaScript files in the `public` directory

### Database Migration

The application automatically creates the database and tables on first run. For production deployments, consider using a proper migration system.

### Environment Variables

You can customize the following environment variables:
- `PORT` - Server port (default: 3000)

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Consider using a process manager like PM2:
```bash
npm install -g pm2
pm2 start dist/server.js --name "typescript-service"
```

## Security Considerations

- The application includes Helmet.js for security headers
- CORS is enabled for cross-origin requests
- Input validation is implemented on both client and server
- SQL injection protection through parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 