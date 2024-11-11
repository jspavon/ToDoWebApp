import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
  })
  export class HttpService {
    private httpOptions: any;

    constructor(
        private http: HttpClient
      ) {    }

   
      private configHttpOptions(){
        var token = sessionStorage.getItem('authToken')
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
             'Authorization':  token ? `Bearer ${token}` : '',
             //'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlyaXMyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzEyNjc2MjYsImV4cCI6MTczMTI3MTIyNn0.PWkKswklN1WTw8wL9OFKvLkLbGRZ-fi9yNqHXH4fbzc' ,
          }),
        };
    
        this.httpOptions.observe = 'response';
      }


      public Get(URL: string, parameters?: any): Observable<any> {
        this.configHttpOptions();
    
        this.httpOptions.params = null;
    
        if (parameters !== undefined) {
          let httpParams = new HttpParams();
          Object.keys(parameters).forEach((element) => {
            httpParams = httpParams.append(element, parameters[element]);
          });
          this.httpOptions.params = httpParams;
        }
    
        return this.http.get<any>(URL, this.httpOptions);
      }

      public Post(URL: string, parameters?: any): Observable<any> {
        this.configHttpOptions();
        let result : any;
        result = this.http.post(URL, parameters, this.httpOptions);
        return result;
      }

      public Put(URL: string, parameters: any): Observable<any> {
        this.httpOptions.params = null;
    
        return this.http.put(URL, parameters, this.httpOptions);
      }

      public Patch(URL: string, parameters: any): Observable<any> {
        this.httpOptions.params = null;
    
        return this.http.patch(URL, parameters, this.httpOptions);
      }
    
      public Delete(URL: string, parameters?: any): Observable<any> {
        this.httpOptions.params = null;
    
        if (parameters !== undefined) {
          let httpParams = new HttpParams();
          Object.keys(parameters).forEach((element) => {
            httpParams = httpParams.append(element, parameters[element]);
          });
          this.httpOptions.params = httpParams;
        }
    
        return this.http
          .delete<any>(URL, this.httpOptions)
          .pipe(catchError(this.handleError));
      }
    
      private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // Cuando Un error del lado del cliente o un error de red occurrio.
          console.error('An error occurred:', error.error.message);
        } else {
          // el backend ha retornado un codigo de respuesta no exitoso.
          // el body de la respuesta puede contener pista de que fue mal,
          console.error(
            `El servidor retorno un  codigo ${error.status}, ` +
            `el body fue: ${error.error}`
          );
        }
        // return an observable with a user-facing error message
        const errroThrow = throwError(() => {
          const err: any = new Error('Algo inesperado sucedio; Por favor, inténtelo de nuevo más tarde.')
          
          return err;
        });

        return errroThrow;
      }

  }