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
  apiUrl: string = environment.production ? '' : 'https://localhost:8000/api';

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

    return this.http.post(`${this.userEndpoint}/login`, payload);
  }

  fetchProfile(email) {
    const payload = {
      email,
    };

    return this.http.get(this.userEndpoint);
  }

  facebookLogin() {
    return this.http.get(this.facebookEndpoint).subscribe((stuff) => {
      console.log(stuff);
    });
  }

  get facebookEndpoint() {
    return `${this.userEndpoint}/facebook`;
  }

  get userEndpoint() {
    return `${this.apiUrl}/user`;
  }
}
