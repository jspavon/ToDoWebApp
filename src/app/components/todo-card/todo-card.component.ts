import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { TaskInterface } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { authService } from '../../services/auth.service'

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.css']
})

export class TodoCardComponent implements OnInit {

  showTodo: boolean = false;
  showCreateUpdated: boolean = false;
  showDeleted: boolean = false;
  isUpdate : boolean = false;
  btnReturn: boolean = false;

  user: string = '';
  pass: string = '';
  messageAuth: string = '';
  tasks: TaskInterface[] = [];
  selectedTag: string = 'All'
  uniqueTasks: TaskInterface[] = [];
  filteredTasks: TaskInterface[] = [];
  taskId: number = 0;
  taskTittle: string = '';
  taskTag: string = '';
  taskCompleted: boolean = false;
  taskMessage: string = '';

  constructor(private taskService: TasksService, private authService: authService) {}

  ngOnInit() {
    var token = sessionStorage.getItem('authToken')
    this.showTodo = token != null ? true : false;
    this.getTasks();
  }

  getTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {

        if(response?.status){
          const uniqueTags = new Set<string>();
          const uniqueTasks: TaskInterface[] = [];

          this.tasks = response.data ? [...response.data] : [];

          this.tasks.forEach(task => {
            if (!uniqueTags.has(task.tag)) {
              uniqueTags.add(task.tag);
              uniqueTasks.push(task);
            }
          });

          this.uniqueTasks = uniqueTasks;
          this.tasks = this.tasks;
          this.filteredTasks = this.tasks;
          this.filterTasks();
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  filterTasks() {
    console.log(this.selectedTag)

    if (this.selectedTag === 'All') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.tag === this.selectedTag);
    }

    console.log(this.filterTasks)
  }

  createTask(){
    let task: TaskInterface = {id : 0, title : this.taskTittle, tag : this.taskTag, completed : false }
    this.taskService.postTask(task).subscribe({
      next:(response) => {
        if(response?.status == 200){
          this.taskMessage = "Registro creado correctamente";         
          this.getTasks();
          this.showDeleted = false;
          this.taskMessage = '';           
        }
      },
      error(err) {
        console.error('Error:', err);
      },
    })
  }

  updateTask(){
    let task: TaskInterface = {id : this.taskId, title : this.taskTittle, tag : this.taskTag, completed : this.taskCompleted }

    this.taskService.putTask(this.taskId, task).subscribe({
      next:(response) => {
        if(response?.status == 200){
          this.taskMessage = "Registro actualizado correctamente.";    
          this.btnReturn = true; 
          this.clearInfo();
          this.Return();
        }
      },
      error(err) {
        console.error('Error:', err);
      },
    })
  }

  deleteTask(id: number){

    this.taskService.deleteTask(id).subscribe({
      next:(response) => {
        if(response?.status == 200){
          this.showDeleted = true;
          this.taskMessage = "Registro eliminado correctamente";         
          this.getTasks();
          this.showDeleted = false;        
        }
      },
      error(err) {
        console.error('Error:', err);
      },
    })
  }

  completedTask(task: TaskInterface){
    task.completed = !task.completed;
    this.taskService.updateStateTask(task).subscribe({
      next:(response) => {
        if(response?.status == 200){    
          this.getTasks();     
        }
      },
      error(err) {
        console.error('Error: ', err);
      },
    })
  }

  getToken(){
    this.messageAuth = '';
    this.authService.authenticateUser(this.user, this.pass).subscribe({
      next: (response) => {
        if(response?.status == 200){
          let token = response.data != null ? response.data : '';
          sessionStorage.setItem('authToken', token);
          this.showTodo = true;
          console.log('Token guardado en sessionStorage');
        }
      },
      error: (error) => {
        console.error('Error al obtener el token', error);
        this.messageAuth = 'Error al obtener el token';
      }
    })
  }

  onCheckboxChange() {
    console.log('El valor de isChecked es: ', this.taskCompleted);
  }

  setInfoUpdate(task: TaskInterface | null){
    this.taskId = task != null ? task?.id : 0;
    this.taskTittle = task != null ? task?.title : "";
    this.taskTag = task != null ? task?.tag : "";
    this.taskCompleted = task != null ? task?.completed : false;
  }

  CreateUpdatedShow(update: boolean, task: TaskInterface | null){
    this.clearInfo();

    if(update){
      this.setInfoUpdate(task);
      this.isUpdate = true;
      this.showTodo = false;
      this.showCreateUpdated = true;
    }else{
      this.showTodo = false;
      this.showCreateUpdated = true;
      this.isUpdate = false;
    }

  }

  Return(){
    this.getTasks();
    this.clearInfo();
    this.btnReturn = false;
    this.showTodo = true;
    this.showCreateUpdated = false;
    this.isUpdate = false;
  }

  CreateUpdatedHide(){
    this.clearInfo();
    this.showTodo = true;
    this.showCreateUpdated = false;
  }

  UpdateShow(){
    this.isUpdate = true;
  }

  clearInfo(){
    this.taskId = 0;
    this.taskTittle = "";
    this.taskTag = "";
    this.taskCompleted = false;
  }

}

