import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../servies/taskService/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { v4 as uuidv4 } from 'uuid';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter'; // Adjust for other adapters if needed
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [MatToolbarModule, ReactiveFormsModule, MatLabel, MatError, MatDatepicker, MatDatepickerModule, MatSelectModule, MatOptionModule, MatNativeDateModule, CommonModule, MatSlideToggleModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatFormFieldModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Adjust locale as needed
    MomentDateAdapter, // Provide the date adapter
  ]
})
export class TaskFormComponent implements OnInit{
  taskForm: FormGroup;
  isEditMode: boolean = false;
  taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Medium', Validators.required],
      notes: [''],
      tags: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if(this.taskId) {
      const task = this.taskService.getTask(this.taskId);
      if(task) {
        this.taskForm.patchValue(task);
        this.isEditMode = true;
      }
    }
  }

  onSubmit(): void {
    if(this.taskForm.valid) {
      const task: Task = {
        ...this.taskForm.value,
        id: this.taskId ? this.taskId: uuidv4()
      };

      if(this.isEditMode) {
        this.taskService.updateTask(task);
      } else {
        this.taskService.addTask(task);
      }

      this.router.navigate(['/']);
    }
  }

}

