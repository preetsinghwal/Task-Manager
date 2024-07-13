import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../models/task.model';
import { LocalStorageService } from '../localStorageService/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());
  tasks = this.tasksSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {}

  private loadTasks(): Task[] {
    return this.localStorageService.get('tasks') || [];
  }

  private saveTasks(tasks: Task[]): void {
    this.localStorageService.set('tasks', tasks);
    this.tasksSubject.next(tasks);
  }

  getTask(id: string): Task | undefined {
    return this.getTasks().find(task => task.id === id);
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks().map(task => task.id === updatedTask.id ? updatedTask : task);
    this.saveTasks(tasks);
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(task => task.id !== id);
    this.saveTasks(tasks);
  }

  getFilteredTasks(filters: { searchTerm: string}): Task[] {
    let tasks = this.getTasks();

    if (filters.searchTerm) {
      tasks = tasks.filter(task =>
        task.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    return tasks;
  }
}
