import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskViewComponent } from './components/task-view/task-view.component';

export const routes: Routes = [
    {path: '', component: TaskListComponent},
    {path: 'task/add', component: TaskFormComponent},
    {path: 'task/edit/:id', component: TaskFormComponent},
    {path: 'task/view/:id', component: TaskViewComponent}
];
