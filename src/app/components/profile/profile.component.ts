import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profilePicUrl: string = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  fetchProfile() {
    const email = 'fakeuser@gmail.com';

    this.apiService.fetchProfile(email);
  }
}
