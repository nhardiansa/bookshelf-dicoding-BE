const {nanoid} = require('nanoid');
const books = require('./bookshelf');

// Menambah sebuah buku
const addBookHandler = (request, h) => {
  const {name, year, author,
    summary, publisher, pageCount,
    readPage, reading} = request.payload;

  const id = nanoid(16);
  let response;
  let finished;

  // pengecekan nama
  if (!name) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // pengecekan readpage
  if ( pageCount === readPage ) {
    finished = true;
  } else if (pageCount < readPage) {
    response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author,
    summary, publisher, pageCount, readPage,
    finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length === 1;

  if (isSuccess) {
    response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  response = h.response({
    status: 'error',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(501);
  return response;
};

// Menampilkan seluruh buku
const getAllBookHandler = () => {
  let response;
  if (books.length === 0) {
    response = {
      status: 'success',
      data: {
        books: [],
      },
    };

    return response;
  }

  response = {
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };

  return response;
};

// Menampilkan detail buku
const getBookDetailHandler = (request, h) => {
  const {id} = request.params;
  let response;

  const book = books.filter((b) => b.id === id)[0];

  if (book === undefined) {
    response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
  };

  response = h.response({
    status: 'success',
    data: {
      book: book,
    },
  });

  response.code(200);
  return response;
};

// Mengubah data buku yang sudah ada
const updateBookDetailHandler = (request, h) => {
  const {id} = request.params;

  const {name, year, author,
    summary, publisher, pageCount,
    readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();
  let response;

  // pengecekan nama
  if (!name) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: `Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount`,
    });

    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// Menhapus buku yang sudah ada
const deleteBookHandler = (request, h) => {
  const {id} = request.params;
  let response;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBookHandler, getBookDetailHandler,
  updateBookDetailHandler, deleteBookHandler,
};
