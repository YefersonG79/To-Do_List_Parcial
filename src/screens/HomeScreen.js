import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = useCallback(async () => {
    try {
      const tasksJSON = await AsyncStorage.getItem('tasks');
      const loadedTasks = tasksJSON ? JSON.parse(tasksJSON) : [];
      setTasks(loadedTasks);
    } catch (error) {
      alert.error('Error al cargar las tareas:', error);
    }
  }, []);

  const saveTasks = useCallback(async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      alert.error('Error al guardar la tarea:', error);
    }
  }, []);

  const toggleComplete = useCallback((id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  }, [tasks, saveTasks]);

  const deleteTask = useCallback((id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  }, [tasks, saveTasks]);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)}>
        <Feather
          name={item.completed ? 'check-circle' : 'circle'}
          size={24}
          color={item.completed ? '#4caf50' : '#ccc'}
        />
      </TouchableOpacity>

      <View style={styles.taskTextContainer}>
        <Text style={[styles.taskTitle, item.completed && styles.taskCompleted]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.taskDescription}>{item.description}</Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Feather name="x-circle" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  ), [toggleComplete, deleteTask]);

  const navigateAddTask = useCallback(() => {
    navigation.navigate('AddTask', { onTaskAdded: loadTasks });
  }, [navigation, loadTasks]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity style={styles.addButton} onPress={navigateAddTask}>
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#aaa',
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
});

export default HomeScreen;
