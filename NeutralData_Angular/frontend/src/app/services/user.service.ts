import { Injectable } from '@angular/core';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';
import { AxiosService } from './axios.service';
import { enviroment } from '../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiServerUrl = enviroment.apiBaseUrl;

  constructor(private http: HttpClient, private axiosService: AxiosService) {}

  async getUsers(): Promise<User[]> {
    try {
      const response = await this.axiosService.request('GET', '/user/all', {});
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async addUser(user: User): Promise<User> {
    try {
      const response = await this.axiosService.request('POST', '/user/add', {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const response = await this.axiosService.request('PUT', '/user/update', {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        enable: user.enable,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      const response = await this.axiosService.request(
        'DELETE',
        '/user/delete/' + userId,
        {}
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public isLogged(): boolean {
    return localStorage.getItem('auth_token') ? true : false;
  }

  public clearToken() {
    localStorage.removeItem('auth_token');
  }

  public getUser(): User {
    if (this.isLogged()) {
      return JSON.parse(atob(localStorage.getItem('auth_token').split('.')[1]));
    } else {
      return null;
    }
  }
}
