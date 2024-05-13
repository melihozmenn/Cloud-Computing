import React, { useEffect, useState } from 'react'
import { TodoModel } from './TodoModel';
import TodoService from './todo.service';
import { TextField, Button, List, ListItem, ListItemText, Grid, Paper, Typography, Divider, Avatar, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import RefreshIcon from '@mui/icons-material/Refresh';



const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'brown', 'black', 'gray', 'cyan', 'magenta', 'lime', 'teal', 'indigo', 'violet', 'fuchsia', 'gold', 'silver', 'crimson'];

const Todos = () => {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    toast.dismiss();
    setLoading(true);
    await TodoService.getAll().then((response) => {
      setTodos(response.data);
      setInput('');
    }).catch((error) => {
      setTodos([]);
      toast.error(error.response.data || 'Bir hata oluştu');
    }).finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  };

  const addTodo = async () => {
    toast.dismiss();
    if (!input) return toast.error('Lütfen bir iş giriniz');

    await TodoService.add({ description: input }).then(() => {
      getTodos();
      toast.success('İş eklendi');
      setLoading(false);
    }).catch((error) => {
      toast.error(error.response.data || 'Bir hata oluştu');
    }).finally(() => {

    });
  };

  const deleteTodo = async (id: string) => {
    await TodoService.delete(id).then(() => {
      setTodos(todos.filter(todo => todo._id !== id));
    }).catch((error) => {
      toast.error(error.response.data || 'Bir hata oluştu');
    }).finally(() => {
      setLoading(false);
    })
  }

  const toggleTodo = async (id: string) => {
    await TodoService.update(id).then(() => {
      const updatedTodo = todos.find(todo => todo._id === id);
      if (updatedTodo) {
        updatedTodo.status = !updatedTodo.status;
        setTodos([...todos]);
      }
    }).catch((error) => {
      toast.error(error.response.data || 'Bir hata oluştu');
    })
  }

  const deleteAllByIds = async (ids: string[]) => {
    await TodoService.deleteAllByIds(ids).then(() => {
      setTodos(todos.filter(todo => !ids.includes(todo._id)));
    }).catch((error) => {
      toast.error(error.response.data || 'Bir hata oluştu');
    })
  }

  const toggleAllByIds = async (ids: string[]) => {
    await TodoService.updateAllByIds(ids).then(() => {
      const updatedTodos = todos.filter(todo => ids.includes(todo._id));
      updatedTodos.forEach(todo => todo.status = !todo.status);
      setTodos([...todos]);
    }).catch((error) => {
      toast.error(error.response.data || 'Bir hata oluştu');
    })
  }

  const renderTodos = (title: string, todos: TodoModel[]) => {

    return (
      <Paper sx={{ p: 2 }} >
        <Typography textAlign="center" fontWeight="bold" variant="h6" gutterBottom
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', }}>
          {title} <RefreshIcon sx={{ cursor: "pointer" }} color='warning' fontSize='large' onClick={getTodos} />
        </Typography>
        <Divider />
        {!loading && todos.length > 0 && <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => toggleAllByIds(todos.map(todo => todo._id))}>
            <SwapHorizontalCircleIcon sx={{ color: 'green', cursor: 'pointer', fontSize: "2rem" }} />
            <Typography variant="body1">Hepsini Taşı</Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer', fontSize: "2rem" }} onClick={() => deleteAllByIds(todos.map(todo => todo._id))} />
            <Typography variant="body1">Hepsini Sil</Typography>
          </Grid>
        </Grid>}
        <List sx={{ maxHeight: "20rem", overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {loading && <CircularProgress />}
            {todos.length === 0 && !loading && <p>Henüz iş eklenmedi</p>}
          </Grid>



          {!loading && todos.map((todo, index) => (
            <ListItem key={todo._id}>
              <Avatar sx={{ backgroundColor: colors[index % colors.length], mr: 1 }}>{index + 1}</Avatar>
              <ListItemText primary={todo.description} />
              <SwapHorizontalCircleIcon sx={{ color: 'green', cursor: 'pointer', fontSize: "2rem" }} onClick={() => toggleTodo(todo._id)} />
              <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer', fontSize: "2rem" }} onClick={() => deleteTodo(todo._id)} />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
            <TextField value={input} onChange={(e) => setInput(e.target.value)}
              label="Yeni bir iş ekle..." variant="standard" sx={{ mb: 2, width: '50%', }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addTodo()
                }
              }}
            />
            <Button onClick={addTodo} variant="outlined" color="success" sx={{ mb: 2, width: '50%', }}>
              Ekle
            </Button>
          </Paper>
        </Grid>

        <Grid item sm={12} md={6}>
          {renderTodos("Yapılacaklar", todos.filter(todo => !todo.status))}
        </Grid>

        <Grid item sm={12} md={6}>
          {renderTodos("Yapılanlar", todos.filter(todo => todo.status))}
        </Grid>

      </Grid>
    </>
  )
}

export default Todos