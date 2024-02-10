import React from 'react'
import { Route, Routes } from 'react-router'
import TodoList from '../pages/TodoList'

function UserRoutes() {
  return (
    <>
    <Routes>

    <Route path='/' element={<TodoList/>} />
    
    </Routes>

    </>
  )
}

export default UserRoutes