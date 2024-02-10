import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import {get} from "lodash"
import { notification } from 'antd';


const TodoList = () => {
  const url = import.meta.env.VITE_SERVER_URL;
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState(null);


const fetchTodos = async () => {
  try {
    const result = await axios.get(`${url}/fetchTodos`);
    const todosData = get(result, "data.data", []).sort((a, b) =>
    new Date(b.createdDate) - new Date(a.createdDate))
    setTodos(todosData);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

  useEffect(() => {
    fetchTodos()
  }, [])


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      if (inputValue.trim() !== '') {
        const newTodo = { name: inputValue, createdDate: Date.now(), status: true };
    
        setTodos(prevTodos => {
          const updatedTodos = [...prevTodos, newTodo];
          return updatedTodos.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        });
    
        const result = await axios.post(`${url}/addTodo`, { inputValue });
        notification.success({ message: result.data.message });
        setInputValue('');
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      notification.error({ message: "Failed to add todo. Please try again later." });
    }
  };
  
  const handleDeleteTodo = async (index) => {
    try {
      const todoToDelete = todos[index];
      const todoId = todoToDelete._id;

      const newTodos = todos.filter((_, i) => i !== index);
      setTodos(newTodos);
  
      if(todoId){
        const result = await axios.delete(`${url}/deleteTodo/${todoId}`)
        notification.success({ message: result.data.message });
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      notification.error({ message: "Failed to delete todo. Please try again later." });
    }
  };

  const handleEditTodo = (index) => {
    setEditingIndex(index);
    setEditValue(todos[index]);
  };

  const handleUpdateTodo = async () => {
    try {
      if (editValue.trim() !== '') {
        const todoToEdit = todos[editingIndex];
        const todoId = todoToEdit._id;
  
        const updatedTodo = {
          ...todoToEdit, 
          name: editValue 
        };
  
        const newTodos = [...todos];
        newTodos[editingIndex] = updatedTodo;
        setTodos(newTodos);
        setEditingIndex(null);
        setEditValue(null);
        if (todoId) {
          const result = await axios.patch(`${url}/updateTodo`,{todoId,editValue})
          notification.success({ message: result.data.message });
        }
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      notification.error({ message: "Failed to update todo. Please try again later." });
    }
  };

  const handleChangeTodoStatus = async (index) => {
    try {
      const todoToChangeStatus = todos[index];
      const todoId = todoToChangeStatus._id;
  
      const updatedTodo = {
        ...todoToChangeStatus, 
        status: false
      };
  
      const newTodos = [...todos];
      newTodos[index] = updatedTodo;
      setTodos(newTodos);
      if(todoId){
        const result = await axios.put(`${url}/changeTodoStatus/${todoId}`)
        notification.success({ message: result.data.message });
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      notification.error({ message: "Failed to mark completed todo. Please try again later." });
    }

  }

  return (
    <>
    
    <div className="md:max-w-md w-[50vw] mx-auto md:mt-10 p-4 mt-2 mb-2 bg-gradient-to-tr from-green-400 to-blue-400 shadow-2xl border rounded-xl md:mb-10">
    <div className='flex flex-col'>
    <h2 className="text-2xl font-sans font-bold mt-4 flex justify-center items-center">Todo List</h2>
    <h1 className='mb-5 font-medium opacity-60 text-sm flex justify-center items-center'>Stay Organized</h1>
    </div>
    <div className="flex flex-col md:flex-row">
      <input
        type="text"
        className="flex-1 rounded-l border border-gray-300 px-4 py-2 mb-2 md:mb-0 md:mr-0"
        placeholder="Add a new todo"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-r"
        onClick={handleAddTodo}
      >
        Add
      </button>
    </div>
    <ul className="mt-4">
      {todos.map((todo, index) => (
        <li key={index} className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 py-2">
          {editingIndex === index ? (
            <input
              type="text"
              className="flex-1 rounded-l border border-gray-300 px-4 py-2 mb-2 md:mb-0 md:mr-2 overflow-hidden w-[40vw]"
              value={editValue.name}
              onChange={(e) => setEditValue(e.target.value)}
            />
          ) : (
            <span className={`overflow-y-auto h-20 w-[30vw] font-medium ${todo.status === false ? 'line-through opacity-20' : ''}`}>{todo.name}</span>
          )}
          <div className="flex">
            {editingIndex === index ? (
              <>
                <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-l" onClick={handleUpdateTodo}>
                  Save
                </button>
                <button className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-r" onClick={() => setEditingIndex(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className={`text-black text-2xl font-bold pr-5 ${todo.status === false ? 'hidden' : ''}`} title='Complete' onClick={() => handleChangeTodoStatus(index)}>
                  <IoMdDoneAll />
                </button>
                <button className={`text-blue-600 text-2xl font-bold pr-5 ${todo.status === false ? 'hidden' : ''}`} title='Edit' onClick={() => handleEditTodo(index)}>
                  <FaEdit />
                </button>
                <button className="text-red-500 text-2xl font-bold" title='Delete' onClick={() => handleDeleteTodo(index)}>
                  <MdDelete />
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
  </>
  );
};

export default TodoList;
