const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.send('Books API running'));
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store
let books = [
  { id: 1, title: "Coraline", author: "Neil Gaiman" },
  { id: 2, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" },
  { id: 1, title: "The Kite Runner", author: "Khaled Hosseini" },
  { id: 2, title: "The Globetrotters", author: "Arefa Tehsin" }
];
let nextId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;

// GET /books...yeh sabhi books return karega
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id...return single book
app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book was NOT found' });
  res.json(book);
});

// POST /books...nayi book add karne ke liye
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title and author are required' });

  const newBook = { id: nextId++, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id...idhar par id se book update ho rahi hogi
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, author } = req.body;
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Book was NOT found' });

  // Partial updates allowed
  if (title) books[index].title = title;
  if (author) books[index].author = author;

  res.json(books[index]);
});

// DELETE /books/:id...book hataa hee denge...yeh bhi id se hee karenge
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Book was NOT found' });

  const removed = books.splice(index, 1)[0];
  res.json(removed);
});

// Simple health route
app.get('/', (req, res) => res.send('Books API running'));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
