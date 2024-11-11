
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { paramEnum } from '../shared/enums/genericEnum';

//Interfaces
import { TaskInterface } from '../interfaces/task.interface';
import { IResponseService } from '../shared/interface/IResponseService';

//Services
import { HttpService } from '../services/http.service'
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private httpService: HttpService) { }

  public getAllTasks() : Observable<IResponseService<TaskInterface[]> | null> {

    let response$ : Observable<IResponseService<TaskInterface[]> | null>;

    let url = `${ paramEnum.baseUrl }tasks`
    response$ = this.httpService.Get(url)
    .pipe(
      map((response: HttpResponse<IResponseService<TaskInterface[]>>) => {
        return response.body
      })
    )

    return response$;
  }


  public postTask(task: TaskInterface): Observable<IResponseService<number> | null> {
    let response$: Observable<IResponseService<number> | null>;

    response$ = this.httpService
      .Post(
        `${ paramEnum.baseUrl }tasks`,
          task
      )
      .pipe(
        map((response: HttpResponse<IResponseService<number> | null>) => {
          return response.body;
        })
      );
    return response$;
  }

  public putTask(id: number, task: TaskInterface): Observable<IResponseService<number> | null> {
    let response$: Observable<IResponseService<number> | null>;
    response$ = this.httpService
      .Put(
        `${ paramEnum.baseUrl }tasks/${id}`,
        task
      )
      .pipe(
        map((response: HttpResponse<IResponseService<number> | null>) => {
          return response.body;
        })
      );
    return response$;
  }

  updateStateTask( task: TaskInterface) : Observable<IResponseService<number> | null> {
    let response$: Observable<IResponseService<number> | null>;

    response$ = this.httpService
    .Patch(`${ paramEnum.baseUrl }tasks/complete/${task.id}`,
      task
    )
    .pipe(
      map((response: HttpResponse<IResponseService<number> | null>) => {
        return response.body;
      })
    );
    return response$;
  }

  public deleteTask(id: number): Observable<IResponseService<boolean> | null> {
    let response$: Observable<IResponseService<boolean> | null>;
    response$ = this.httpService.Delete(`${ paramEnum.baseUrl }tasks/${id}`)
      .pipe(
        map((response: HttpResponse<IResponseService<boolean> | null>) => {
          return response.body;
        })
      );
    return response$;
  }

  
}


