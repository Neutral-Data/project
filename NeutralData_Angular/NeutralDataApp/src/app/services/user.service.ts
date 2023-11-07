import { Injectable } from '@angular/core';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';
import { AxiosService } from './axios.service';
import { enviroment } from '../environments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService{
    private apiServerUrl = enviroment.apiBaseUrl;

    constructor(private http: HttpClient,private axiosService: AxiosService){ }


    async getUsers():Promise<User[]>{
        try {
            const response = await this.axiosService.request(
                "GET",
                "/user/all",
                {}
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
  
    async addUser(user: User):Promise<User>{
        try {
            const response = await this.axiosService.request(
                "POST",
                "/user/add",
                {
                firstName: user.firstName,
		        lastName: user.lastName,
		        username: user.username,
            	email: user.email,
		        password: user.password,
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    

    public updateUser(user: User):Observable<User>{
        return this.http.put<User>(`${this.apiServerUrl}/user/update`,user);
    }

    public deleteUser(userId: number):Observable<void>{
        return this.http.delete<void>(`${this.apiServerUrl}/user/delete/${userId}`);
    }


    public isLogged(): boolean{
        return localStorage.getItem('auth_token') ? true : false;
    }

    public getUser():User{
        if(this.isLogged()){
        return JSON.parse(atob(localStorage.getItem('auth_token').split('.')[1]));
        }else{
            return null;
        }
      }
    
}