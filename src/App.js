import React from 'react'
import { Route, Link } from 'react-router-dom'
import { BookList, BookShelf } from './Books'
import * as BooksAPI from './BooksAPI'
import './App.css'

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

  updateBook = (book, newShelf) => {
    this.setState({ books: this.state.books.map((b) => b.id !== book.id ? b : book) })
    this.props.updateBook(book, newShelf)
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
          <BookList books={this.state.books} updateBook={this.updateBook}/>
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
