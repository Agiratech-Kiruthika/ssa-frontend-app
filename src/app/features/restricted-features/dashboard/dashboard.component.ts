import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/http/auth.service';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,CreatePostComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  selectedSection: string = 'home';  
  profileMenuVisible: boolean = false;  

  constructor
  (private authService: AuthService, private router: Router) {}
  
  changeSection(section: string) {
    this.selectedSection = section;
  }

  logout() {
   
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }


  toggleProfileMenu() {
    this.profileMenuVisible = !this.profileMenuVisible;
  }

  editProfile() {
    this.profileMenuVisible = false; 
    console.log('Edit Profile');
  }


  viewProfile() {
    this.profileMenuVisible = false; 
    console.log('View Profile');
  }
}
