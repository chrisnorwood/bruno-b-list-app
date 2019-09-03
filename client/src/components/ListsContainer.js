import React from 'react'
import axios from 'axios'

import List from './List'
import NewListForm from './NewListForm'
import EditListForm from './EditListForm'

class ListsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lists: [],
      editingListId: null,
    }

    this.addNewList = this.addNewList.bind(this)
    this.removeList = this.removeList.bind(this)
    this.editList = this.editList.bind(this)
    this.editingList = this.editingList.bind(this)
  }

  componentDidMount() {
    axios.get('/api/v1/lists.json')
      .then(response => {
        console.log("response: ", response)
        this.setState({
          lists: response.data
        })
      })
      .catch(error => console.log(error))
  }

  addNewList (title, excerpt) {
    axios.post('/api/v1/lists', { list: {title, excerpt} })
      .then(response => {
        console.log('Post list response:', response)
        const lists= [ ...this.state.lists, response.data ]
        this.setState({lists})
      })
      .catch(error => {
        console.log('Error posting new list:', error)
      })
  }

  removeList (id) {
    axios.delete('/api/v1/lists/' + id)
      .then(response => {
        const lists = this.state.lists.filter(
          list => list.id !== id
        )

        this.setState({ lists })
      })
      .catch(error => console.log('Error deleting list:', error))
  }

  editList(id, title, excerpt) {
    axios.put('/api/v1/lists/' + id, {
      list: {
        title,
        excerpt
      }
    })
    .then(response => {
      console.log('Update List Response:', response)
      const lists = this.state.lists;
      lists[id-1] = {id, title, excerpt}
      this.setState(() => ({
        lists,
        editingListId: null
      }))
    })
    .catch(error => console.log('Error updating list: ', error))
  }

  editingList(id) {
    this.setState({
      editingListId: id
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className='lists-container'>
          {this.state.lists.map( list => {
            if ( this.state.editingListId === list.id ) {
              return (
                <EditListForm
                  list={list}
                  key={list.id}
                  editList={this.editList}
                />
              )
            } else {
              return (
                <List
                  list={list}
                  key={list.id}
                  onRemoveList={this.removeList}
                  editingList={this.editingList}
                />
              )
            }
          })}
        </div>

        <NewListForm onNewList={this.addNewList} />
      </React.Fragment>
    )
  }
}

export default ListsContainer