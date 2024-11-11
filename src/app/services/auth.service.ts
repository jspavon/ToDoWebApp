
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { paramEnum } from '../shared/enums/genericEnum'

//Interfaces
import { IResponseService } from '../shared/interface/IResponseService';
import { authInterface } from '../interfaces/auth.interface'

//Services
import { HttpService } from '../services/http.service'
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class authService {
  constructor(private httpService: HttpService) { }

  public authenticateUser(user: string, pass: string) : Observable<IResponseService<string> | null> {

    let response$ : Observable<IResponseService<string> | null>;

    let url = `${ paramEnum.baseUrl }auth/token`

    let authInterface: authInterface = {id: 2, username: user, password : pass}

    response$ = this.httpService.Post(url, authInterface)
    .pipe(
      map((response: HttpResponse<IResponseService<string>>) => {
        return response.body
      })
    )

    return response$;
  }
}

