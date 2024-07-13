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

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [MatToolbar, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, CommonModule, MatCardActions, RouterModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchControl = new FormControl('');

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // this.taskService.tasks.subscribe(tasks => this.tasks = tasks)
    this.loadTasks();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.filterTasks());

  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
    this.filterTasks();
  }

  filterTasks() {
    const filter = {
      searchTerm: this.searchControl.value || '',
    }
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
