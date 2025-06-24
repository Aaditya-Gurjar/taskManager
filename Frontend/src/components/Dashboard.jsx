import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { createTask, deleteTask, getAllTasks, updateTask } from './commonAPI/taskAPI';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from './commonAPI/userAPI';



export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const navigate = useNavigate()
  const handleOpenModal = () => {
    setTaskData({ title: '', description: '' });
    setIsEditMode(false);
    setEditTaskId(null);
    setOpenModal(true);
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [taskData, setTaskData] = useState({ title: '', description: '', completed: false })
  const [getTasks, setTasks] = useState([]);



  const taskSubmitHandler = async () => {
    try {
      if (isEditMode) {
        // Call updateTask API (implement this in your API utils)
        const res = await updateTask(editTaskId, taskData);
        if (!res.status) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          setOpenModal(false);
          fetchTasks();
        }
      } else {
        const res = await createTask(taskData);
        if (!res.status) {
          toast.error(res.message);
        }
        if (res.status) {
          toast.success(res.message);
          setOpenModal(false);
          fetchTasks();
        }
      }
    } catch (error) {
      console.error("err", error)
    }
  }

  const handleEdit = (row) => {
    setTaskData({
      title: row.title,
      description: row.description,
      completed: row.completed === true || row.completed === 'true' ? true : false,
    });
    setIsEditMode(true);
    setEditTaskId(row.id);
    setOpenModal(true);
  }


  const handleDelete = async (row) => {

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      })

      console.log("result.isConfirmed", result.isConfirmed)
      if (result.isConfirmed) {
        const res = await deleteTask(row.id);
        if (res.status) {
          toast.success(res.message)
          fetchTasks();
        }
        else {
          toast.error(res.message)
        }
      }

    } catch (error) {
      console.log("err", error)
    }
  }

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.tasks.map((task, index) => ({
        ...task,
        id: task._id || task.id, // use _id if available
      })));
    } catch (error) {
      console.error("err", error)
    }
  }

  // Logout handler
  const handleLogout = async () => {

    try {
      await logoutUser();
      navigate('/login')

    } catch (error) {
      console.error('err', error)
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'title', headerName: 'Task Title', width: 150 },
    { field: 'description', headerName: 'Task Description', width: 150 },
    { field: 'completed', headerName: 'Status', width: 70 },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'Delete',
      headerName: 'Delete',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.row)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 2 };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700 drop-shadow">Task Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition font-semibold"
          >
            Logout
          </button>
        </div>
        <button
          onClick={handleOpenModal}
          className="submit-btn bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-500 hover:to-purple-500 transition mb-6 block mx-auto"
        >
          Add Task
        </button>
        <Paper className="rounded-xl shadow-lg overflow-hidden" sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={getTasks}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[2, 5, 10]}
            checkboxSelection
            sx={{ border: 0, background: 'transparent' }}
            className="bg-white"
          />
        </Paper>
      </div>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Custom overlay for blurred, semi-transparent background */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" />
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="relative z-10"
          >
            <Box
              sx={style}
              className="rounded-xl shadow-2xl bg-white p-8 w-full max-w-2xl mx-auto"
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                className="text-3xl font-semibold text-purple-700 mb-8 text-center"
              >
                {isEditMode ? 'Edit Task' : 'Add Task'}
              </Typography>

              {/* Title */}
              <div className="grid grid-cols-3 items-center gap-4 mb-5">
                <label htmlFor="Title" className="text-right text-sm font-medium text-gray-700">
                  Task Title:
                </label>
                <input
                  type="text"
                  placeholder="Enter Task Name"
                  id="Title"
                  name="title"
                  className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={taskData.title}
                  onChange={(e) =>
                    setTaskData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Description */}
              <div className="grid grid-cols-3 items-center gap-4 mb-5">
                <label htmlFor="Description" className="text-right text-sm font-medium text-gray-700">
                  Description:
                </label>
                <input
                  type="text"
                  placeholder="Enter Task Description"
                  id="Description"
                  name="description"
                  className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Completed (only in edit mode) */}
              {isEditMode && (
                <div className="grid grid-cols-3 items-center gap-4 mb-5">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Completed:
                  </label>
                  <select
                    name="completed"
                    value={taskData.completed}
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onChange={(e) =>
                      setTaskData((prev) => ({
                        ...prev,
                        completed: e.target.value === 'true',
                      }))
                    }
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-500 hover:to-purple-500 transition font-semibold mt-6"
                onClick={taskSubmitHandler}
              >
                {isEditMode ? 'Update Task' : 'Create Task'}
              </button>
            </Box>

          </Modal>
        </div>
      )}
    </div>
  );
}
