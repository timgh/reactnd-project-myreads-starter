import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BookShelf extends React.Component {
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

class BookList extends React.Component {
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

class Book extends React.Component {
  moveTo = (event) => {
    const newShelf = event.target.value
    const book = this.props.book
    const updateBook = this.props.updateBook
    console.log(`move ${book.id} from  ${book.shelf} to ${newShelf}`)
    updateBook({ ...book, shelf:newShelf} , newShelf)
  }

  render() {
    const book = this.props.book
    const image = book.imageLinks ? book.imageLinks.thumbnail : ""
    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 192, 
               backgroundImage: `url(${image})` }}></div>
          <div className="book-shelf-changer">
            <select value={book.shelf} onChange={this.moveTo}>
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


class MainPage extends React.Component {
  render() {
    const books = this.props.books
    const currentlyReading = books.filter(book => book.shelf === "currentlyReading" )
    const wantToRead = books.filter(book => book.shelf === "wantToRead" )
    const read = books.filter(book => book.shelf === "read" )
    
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf title="Currently Reading" books={currentlyReading} updateBook={this.props.updateBook} />
            <BookShelf title="Want to Read" books={wantToRead} updateBook={this.props.updateBook} />
            <BookShelf title="Read" books={read} updateBook={this.props.updateBook} />
          </div>
        </div>
        <Link to='/search' className='open-search'>
          <button>Add a book</button>
        </Link>
      </div>
    )
  }
}


class SearchPage extends React.Component {
  state = {
    books: []
  }

  searchBooks = (query) => {
    console.log("query: " + query)
    if (query !== "") {
      BooksAPI.search(query).then(books => {
        if (!books.error) {
          books.forEach(book => {
            const onShelf = this.props.books.find(b => b.id === book.id)
            book.shelf = onShelf ? onShelf.shelf : "none"
          });
          this.setState({ books })
        } else
        {
          console.log(books.error)
          this.setState({ books: [] })
        }
      }).catch(err => console.warn(err))
    } else {
      this.setState({ books: [] })
    }
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <button className="close-search" onClick={this.props.onClose}>Close</button>
          <div className="search-books-input-wrapper">
            <input type="text" placeholder="Search by title or author"
              onChange={(event) => this.searchBooks(event.target.value)} />
          </div>
        </div>
        <div className="search-books-results">
          <BookList books={this.state.books} updateBook={this.props.updateBook}/>
        </div>
      </div>
    )
  }
}

class BooksApp extends React.Component {
  state = {
    books: []
  } 

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  updateBook = (book, newShelf) => {
    console.log("updateBook")
    BooksAPI.update(book, newShelf).then(result => {
      this.setState({ books: this.state.books.filter((b) => b.id !== book.id).concat([book]) })
    }).catch(err => console.warn(err))
  } 

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <MainPage books={this.state.books} updateBook={this.updateBook}/>
        )}/>  

        <Route path='/search' render={({ history }) => (
          <SearchPage books={this.state.books} updateBook={this.updateBook} onClose={() => history.push('/')}/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
