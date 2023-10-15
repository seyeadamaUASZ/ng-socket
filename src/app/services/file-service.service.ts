import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {
  apiSenico = environment.api;

  constructor(private http:HttpClient) { 

  }

  loadFiles(num:any):Observable<any>{
    return this.http.get(this.apiSenico+'file/lecture/'+num)
  }
}
