import { Grid } from '@mui/material'
import './App.css'
import Navbar from './Navbar'
import Todos from './Todos'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



function App() {

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <Grid container spacing={3} >
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={9} sx={{ margin: "auto",mb:2 }} >
          <Todos />
        </Grid>
      </Grid>
    </>
  )
}

export default App
