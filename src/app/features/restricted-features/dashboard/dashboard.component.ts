import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/http/auth.service';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../create-post/create-post.component';
import { FeedComponent } from '../feed/feed.component';
import { HomeComponent } from '../home/home.component';
import { LogoutConfirmationComponent } from '../../../ui/confirmation-dialog/confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  selectedSection: string = 'home';

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  changeSection(section: string) {
    this.selectedSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  confirmLogout() {
    const dialogRef = this.dialog.open(LogoutConfirmationComponent, {
      width: '400px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logout();
      }
    });
  }
}
