import React from "react";
import { useState, useEffect } from "react";
import { Location } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from './components/Tasks'
import AddTask from "./components/AddTask";
import About from "./components/About";



function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const getTaskFromServer = await fetchTasks()
      setTasks(getTaskFromServer)
    }
    getTasks()
  }, [])

    // Fetch Tasks
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json()
      // console.log(data)
      
      return data
    }

  
  // fetch task end

  //  AddTask
  const addTask = async (task) => {
    //  simple way to add task 
    // //  console.log('task',task);
    // const id = Math.floor(Math.random() * 
    // 10000 ) + 1
    // console.log(id,'settasks',setTasks)
    // const newTask = { id , ...task }
    // setTasks([...tasks , newTask])

    // addTask through json server post request 
    const res = await fetch("http://localhost:5000/tasks/", {
      method: 'POST',
      headers: {
        'content-type': "application/json",
      },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks([...tasks, data])
  }

  // Delete Task
  // simple delete task 
  // const deleteTasks=(id)=>{
  //   // console.log("deleteTasks",id);
  //   setTasks(tasks.filter((task)=> task.id !==id))
  // }

  // delete task from server
  const deleteTasks = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "Delete",
    })
    setTasks(tasks.filter((task) =>
      task.id !== id
    ))
  }
  //  1st single fetch task use for toggle 
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    // console.log(data)
    return data
  }
  // end 1st single.....


  // Toggle reminder
  const toggleReminder = async (id) => {
    //  console.log('toggle Reminder',id);
    const taskToToggle = await fetchTask(id)
    const updateTask = {
      ...taskToToggle,
      reminder: !taskToToggle.reminder
    }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })
    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? {
          ...task, reminder:
            // !task.reminder
            data.reminder
        }
          : task

      ))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask
          (!showAddTask)} showAdd={showAddTask} />
        <Routes>
          <Route
            path='/'
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTasks}
                    onToggle={toggleReminder}
                  />
                ) : (
                  'No Tasks To Show'
                )}
              </>
            }
          />
          <Route path='/about' element={<About />} />
        </Routes>
    <Footer/>
      </div>
      </Router>
    
  )
}

export default App
