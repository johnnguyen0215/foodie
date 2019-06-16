import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  // TODO: Figure out production environment url.
  apiUrl: string = environment.production ? '' : 'http://localhost:8000/api';

  signUp (name: string, email: string, password: string) {
    const payload = {
      user: {
        name,
        email,
        password,
      },
    };

    return this.http.post(this.userEndpoint, payload);
  }

  login (email: string, password: string) {
    const payload = {
      user: {
        email,
        password,
      },
    };

    return this.http.post(this.userEndpoint, payload);
  }

  fetchProfile(email) {
    const payload = {
      email,
    };

    return this.http.get(this.userEndpoint);
  }

  get userEndpoint() {
    return `${this.apiUrl}/user`;
  }
}
