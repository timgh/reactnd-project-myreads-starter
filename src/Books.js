
import React from 'react'

export class BookShelf extends React.Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.title}</h2>
        <div className="bookshelf-books">
          <BookList books={this.props.books} updateBook={this.props.updateBook} />
        </div>
      </div>
    )
  }
}

export class BookList extends React.Component {
  render() {
    return (
      <ol className="books-grid">
        {this.props.books.map((book) => (
          <li key={book.id}>
            <Book book={book} updateBook={this.props.updateBook} />
          </li>
        ))}
      </ol>
    )
  }
}

export class Book extends React.Component {
  moveToShelf = (newShelf) => {
    const { book, updateBook } = this.props
    console.log(`move ${book.id} from  ${book.shelf} to ${newShelf}`)
    updateBook({ ...book, shelf: newShelf }, newShelf)
  }

  render() {
    const book = this.props.book
    const image = book.imageLinks ? book.imageLinks.thumbnail : ""
    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{
            width: 128, height: 192,
            backgroundImage: `url(${image})`
          }}></div>
          <div className="book-shelf-changer">
            <select value={book.shelf} onChange={(event) => this.moveToShelf(event.target.value)}>
              <option value="move" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{book.authors}</div>
      </div>
    )
  }
}