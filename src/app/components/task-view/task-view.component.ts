import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../servies/taskService/task.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [MatToolbar, MatCard, MatCardTitle, MatCardContent, MatSlideToggle, CommonModule, MatButtonModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit{

  task: Task | undefined;

  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.task = this.taskService.getTask(id);
    }

    if(!this.task) {
      this.router.navigate(['/']);
    }
  }

  goToBack(): void {
    this.router.navigate(['/']);
  }
}
