import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  // TODO: Figure out production environment url.
  apiUrl = 'https://localhost:8000/api';

  signUp (name: string, email: string, password: string) {
    console.log(this.apiUrl);
    const payload = {
      user: {
        name,
        email,
        password,
      },
    };

    return this.http.post(`${this.userEndpoint}/register`, payload);
  }

  login (email: string, password: string) {
    const payload = {
      user: {
        email,
        password,
      },
    };

    return this.http.post(`${this.userEndpoint}/login`, payload);
  }

  fetchProfile(email) {
    const payload = {
      email,
    };

    return this.http.get(this.userEndpoint);
  }

  get facebookEndpoint() {
    return `${this.userEndpoint}/auth/facebook`;
  }

  get googleEndpoint() {
    return `${this.userEndpoint}/auth/google`;
  }

  get userEndpoint() {
    return `${this.apiUrl}/users`;
  }
}
