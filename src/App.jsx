import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('https://users.cyclic.app/todos');
    const todosData = await response.json();
    setTodos(todosData);
  };

  const addTodo = async () => {
    if (newTodoText.trim() === '') {
      return;
    }
    const response = await fetch('https://users.cyclic.app/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: `text=${encodeURIComponent(newTodoText)}`
    });
    if (response.ok) {
      setNewTodoText('');
      fetchTodos();
    }
  };

  const editTodo = async () => {
    const response = await fetch(`https://users.cyclic.app/todos/${editTodoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: `text=${encodeURIComponent(editTodoText)}`
    });
    if (response.ok) {
      setEditTodoId(null);
      setEditTodoText('');
      fetchTodos();
    }
  };

  const deleteTodo = async (id) => {
    const response = await fetch(`https://users.cyclic.app/todos/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      fetchTodos();
    }
  };

  const handleEdit = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" align="center" gutterBottom>
        Todo App
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Add a new todo"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={addTodo} style={{ marginBottom: '1rem' }}>
        Add Todo
      </Button>
      <List>
        {todos.map(todo => (
          <ListItem key={todo.id} divider>
            {editTodoId === todo.id ? (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={editTodoText}
                  onChange={(e) => setEditTodoText(e.target.value)}
                />
                <IconButton aria-label="save" onClick={editTodo}>
                  <SaveIcon />
                </IconButton>
                <IconButton aria-label="cancel" onClick={() => handleEdit(null, '')}>
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <>
                <ListItemText primary={todo.text} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="edit" onClick={() => handleEdit(todo.id, todo.text)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default TodoApp;
