# Markdown Notes API By Ahmed Hesham

A RESTful API for uploading, saving, and rendering markdown notes as HTML. This project demonstrates file uploads in a RESTful architecture, markdown parsing, and rendering with secured endpoints.

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Libraries**:
  - `marked`: Converts Markdown to HTML
  - `multer`: Handles file uploads
  - `mysql2`: MySQL client for Node.js with promise support
  - `helmet`: Security middleware
  - `dotenv`: Environment variable management

## API Security

The API is secured using:
- API key authentication for all endpoints
- HTTP security headers via Helmet middleware
- Input validation for all requests

## Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=markdown_note_app
   PORT=3000
   API_KEY=your_secure_api_key
   ```
4. Set up the database:
   ```
   mysql -u root -p < db_schema.sql
   ```
5. Start the server:
   ```
   npm start
   ```
   Or for development:
   ```
   npm run dev
   ```

## API Endpoints

All endpoints are versioned under `/api/v1` and require the `x-api-key` header for authentication.

### Upload a Markdown File

- **Endpoint**: `POST /api/v1/notes/upload`
- **Headers**:
  - `x-api-key`: Your API key
- **Body**: `form-data` with key `markdownFile` containing the markdown file
- **Response**: `201 Created` with note ID and filename
- **Error Codes**:
  - `400 Bad Request`: No file or invalid file
  - `401 Unauthorized`: Invalid API key
  - `409 Conflict`: File with same name exists
  - `500 Internal Server Error`: Server-side error

### Save a Markdown Note

- **Endpoint**: `POST /api/v1/notes`
- **Headers**:
  - `x-api-key`: Your API key
  - `Content-Type`: `application/json`
- **Body**:
  ```json
  {
    "filename": "example.md",
    "markdownContent": "# Hello, world!"
  }
  ```
- **Response**: `201 Created` with note ID and filename
- **Error Codes**:
  - `400 Bad Request`: Missing required fields
  - `401 Unauthorized`: Invalid API key
  - `409 Conflict`: File with same name exists
  - `500 Internal Server Error`: Server-side error

### List All Notes

- **Endpoint**: `GET /api/v1/notes`
- **Headers**:
  - `x-api-key`: Your API key
- **Response**: `200 OK` with array of note objects
  ```json
  [
    {
      "id": 1,
      "filename": "example.md",
      "created_at": "2023-08-01T12:00:00.000Z"
    }
  ]
  ```
- **Error Codes**:
  - `401 Unauthorized`: Invalid API key
  - `500 Internal Server Error`: Server-side error

### Render Note by ID as HTML

- **Endpoint**: `GET /api/v1/notes/:id/html`
- **Headers**:
  - `x-api-key`: Your API key
- **Response**: `200 OK` with HTML content
- **Error Codes**:
  - `401 Unauthorized`: Invalid API key
  - `404 Not Found`: Note not found
  - `500 Internal Server Error`: Server-side error

### Render Note by Filename as HTML

- **Endpoint**: `GET /api/v1/notes/filename/:filename/html`
- **Headers**:
  - `x-api-key`: Your API key
- **Response**: `200 OK` with HTML content
- **Error Codes**:
  - `401 Unauthorized`: Invalid API key
  - `404 Not Found`: Note not found
  - `500 Internal Server Error`: Server-side error

## Usage Examples

### Using CURL

#### Upload a Markdown File
```bash
curl -X POST http://localhost:3000/api/v1/notes/upload \
  -H "x-api-key: your_secret_api_key" \
  -F "markdownFile=@example.md"
```

#### Save a Markdown Note
```bash
curl -X POST http://localhost:3000/api/v1/notes \
  -H "x-api-key: your_secret_api_key" \
  -H "Content-Type: application/json" \
  -d '{
        "filename": "from-curl.md",
        "markdownContent": "# Note from cURL\n\nThis note was created using cURL."
      }'
```

#### List All Notes
```bash
curl -X GET http://localhost:3000/api/v1/notes \
  -H "x-api-key: your_secret_api_key"
```

#### Render Note by ID
```bash
curl -X GET http://localhost:3000/api/v1/notes/1/html \
  -H "x-api-key: your_secret_api_key"
```

#### Render Note by Filename
```bash
curl -X GET http://localhost:3000/api/v1/notes/filename/example.md/html \
  -H "x-api-key: your_secret_api_key"
```

### Using Postman

#### Upload a Markdown File
1. Create a new POST request to `http://localhost:3000/api/v1/notes/upload`
2. Add header: `x-api-key: your_secret_api_key`
3. In the Body tab, select `form-data`
4. Add key `markdownFile`, change type to `File`, and select your markdown file
5. Send the request

#### Save a Markdown Note
1. Create a new POST request to `http://localhost:3000/api/v1/notes`
2. Add header: `x-api-key: your_secret_api_key`
3. Add header: `Content-Type: application/json`
4. In the Body tab, select `raw` and choose `JSON` format
5. Enter the JSON payload:
   ```json
   {
     "filename": "from-postman.md",
     "markdownContent": "# Note from Postman\n\nThis note was created using Postman."
   }
   ```
6. Send the request

#### List All Notes
1. Create a new GET request to `http://localhost:3000/api/v1/notes`
2. Add header: `x-api-key: your_secret_api_key`
3. Send the request

#### Render Note by ID
1. Create a new GET request to `http://localhost:3000/api/v1/notes/1/html`
   (replace `1` with the actual note ID)
2. Add header: `x-api-key: your_secret_api_key`
3. Send the request

#### Render Note by Filename
1. Create a new GET request to `http://localhost:3000/api/v1/notes/filename/example.md/html`
   (replace `example.md` with the actual filename)
2. Add header: `x-api-key: your_secret_api_key`
3. Send the request

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in a consistent format:

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Note not found."
}
```

## License

ISC

## Author
Ahmed Hesham

## Project URLs
- https://roadmap.sh/projects/markdown-note-taking-app
- https://github.com/AhmedHeshamC/markdown-to-html-api
