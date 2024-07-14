import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../servies/taskService/task.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [MatToolbar, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, CommonModule, MatCardActions, RouterModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSlideToggle],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchControl = new FormControl('');
  showCompletedControl = new FormControl(false);

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.taskService.tasks.subscribe(tasks => {
      this.tasks = tasks
      this.filterTasks();
    })
  
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      console.log('search term', value)
      this.filterTasks()
    });

    this.showCompletedControl.valueChanges.subscribe(() => this.filterTasks());
  }

  filterTasks(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const showCompleted = this.showCompletedControl.value;
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm);
      const matchesCompletion = !showCompleted || task.completed;
      return matchesSearch && matchesCompletion;
    });
  }

  markAsCompleted(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task);
  }

  deleteTask(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {message: 'Are you sure that you want to delete this task?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.taskService.deleteTask(id);
      }
    })
  }

}
