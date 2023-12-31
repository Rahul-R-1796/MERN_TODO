import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TodoItem from './TodoItem';
import { styled } from 'styled-components';

const TodoForm = () => {
  const link = 'https://mern-todo-api-7vr9.onrender.com/api/v1/crud';
  const [todos, setTodos] = useState([])
  const [todoName, setTodoName] = useState('')
  const [todoComment, setTodoComment] = useState('')
  const [editTodoData, setEditTodoData] = useState(null)

  useEffect(() => {
    getTodos();
    console.log(todos)
  }, [])

  useEffect(() => { // ! for editing
    if (editTodoData) {
      setTodoName(editTodoData.name ? editTodoData.name : '')
      setTodoComment(editTodoData.name ? editTodoData.comment : '')
    }
  }, [editTodoData])
  
  async function getTodos() { // ! To show the data in the list.
    const data = await axios.get(link)
    setTodos(data.data.crud)
  }

  const editTodos = (todosData) => {
    setEditTodoData(todosData);
  }  

  async function addTodos(e) {
    e.preventDefault();

    const todoData = {
      name: todoName ? todoName : undefined,
      comment: todoComment ? todoComment : undefined
    }

    if (!editTodoData) { // ! only post if editTodoData is not provided
      await axios.post(link, todoData)
    } else {
      await axios.patch(`https://mern-todo-api-7vr9.onrender.com/api/v1/crud/${editTodoData._id}`, todoData) // ! Update the data if we do have the editTodoData
    }

    setTodoName('');
    setTodoComment('');
    getTodos(); // ! calling this function so we don't have to refresh the page anymore.
    setEditTodoData('')
  }

  const renderTodos = () => {

    // ! sort the newest todo item to be on the top of the list.
    let sortedTodos = [...todos];
    sortedTodos = sortedTodos.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    // ! =================================
    
    return sortedTodos.map((todo, i) => {
      return <TodoItem key={i} todo={todo} getTodos={getTodos} editTodos={editTodos}/>
    })
  }

  const insertTodos = () => {
    return <div className="Texteditor">
      <form onSubmit={addTodos}>

          <div className="input-control">
            <input  
              id='id' 
              name='name' 
              type="text" 
              placeholder='Enter Name...' 
              value={todoName} 
              onChange={(e) => setTodoName(e.target.value)}
              required
              />
          </div>

          <div className="input-control">
            <textarea 
              id='comment' 
              name='' 
              cols="30" 
              rows="5" 
              placeholder='Task Name...' 
              value={todoComment}
              onChange={(e) => setTodoComment(e.target.value)}></textarea>
          </div>

          <button className="submit-btn">Add Item</button>
        
      </form>
    </div>
  }
  
  return (
    <TodoFormStyled>
      {insertTodos()}
      {renderTodos()}
    </TodoFormStyled>
  )
}

const TodoFormStyled = styled.div`
  width: 80%;

  display: flex;
  align-items: center;
  flex-direction: column;

  .Texteditor {
    width: 60%;
    padding-top: 4rem;

    form {
      padding-bottom: 5rem;

      .submit-btn {
        padding: .5rem 1.5rem;
        outline: none;
        cursor: pointer;
        background-color: #6BBE92;
        border: none;
        border-radius: 34px;
        color: #fff;
        filter: drop-shadow(0px 4px 28px rgba(0, 0, 0, 0.25));
      }
    }
  }
`

export default TodoForm
