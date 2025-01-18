// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AddMeetingComponent } from '../../AddMeeting/add-meeting/add-meeting.component';
// import { Router } from '@angular/router';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
// import { DatePipe } from '@angular/common';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-meetings',
//   templateUrl: './meetings.component.html',
//   styleUrls: ['./meetings.component.scss'],
//   standalone: true,
//   imports: [CommonModule, FormsModule,AddMeetingComponent,FontAwesomeModule,DatePipe,MatSnackBarModule],
// })

// export class MeetingsComponent implements OnInit {
//   meetings: any[] = [];
//   filterOptions = ['ALL', 'PAST', 'TODAY', 'UPCOMING'];
//   selectedFilter = 'ALL';
//   searchTerm = '';
//   currentTab = 'filter'; 
//   attendeeEmail: string = ''; 
//   faCircleUser = faCircleUser;
//   users: any[] = []; // List of all users
//   filteredUsers: any[] = []; // Add this line to declare filteredUsers
//   filteredEmails: string[] = []; // List of filtered emails based on input


//   constructor(private http: HttpClient,private router: Router,private snackBar: MatSnackBar) {}

//   ngOnInit(): void {
//     this.fetchMeetings();
//     this.fetchUsers();
//   }

//   openSnackBar(message: string, action: string = 'Close', isError: boolean = false): void {
//     this.snackBar.open(message, action, {
//       duration: 5000, // 5 seconds
//       verticalPosition: 'top',
//       horizontalPosition: 'right',
//       panelClass: isError ? 'snack-bar-error' : 'snack-bar-success',
//     });
//   }

//   fetchUsers() {
//     this.http.get<any[]>('https://localhost:7050/api/Users/getalluser').subscribe(
//       (users) => {
//         // Directly map the users from the response
//         this.users = users.map(user => ({
//           name: user.name,
//           email: user.email,
//         }));
  
//         // Initialize filteredUsers with the full user list
//         this.filteredUsers = this.users;
//       },
//       (error) => {
//         console.error('Error fetching users:', error);
//       }
//     );
//   }
  

//   onEmailInput(meetingId: number): void {
//     const meeting = this.meetings.find(m => m.id === meetingId);
//     if (meeting) {
//       const query = meeting.attendeeEmail.toLowerCase();
//       // Filter emails that match the typed text
//       this.filteredEmails = this.users
//         .filter(user => user.email.toLowerCase().includes(query))
//         .map(user => user.email);
//     }
//   }

//   selectEmail(meetingId: number, email: string): void {
//     const meeting = this.meetings.find(m => m.id === meetingId);
//     if (meeting) {
//       meeting.attendeeEmail = email;  // Set the selected email to the input
//       this.filteredEmails = [];  // Clear the suggestions list after selection
//     }
//   }

 


// // fetchMeetings(): void {
// //   const token = localStorage.getItem('authToken');
// //   console.log('Token retrieved from localStorage:', token);

// //   if (!token) {
// //     console.error('No token found. Redirect to login.');
// //     return;
// //   }

  
// //   this.http
// //     .get<any[]>('https://localhost:7050/api/Meeting/all')
// //     .subscribe({
// //       next: (data: any) => {
// //         console.log('Meetings fetched successfully:', data);
// //         this.meetings = data;
// //       },
// //       error: (err: any) => {
// //         console.error('Error fetching meetings:', err);
// //         console.error('Error details:', JSON.stringify(err));
       
// //         if (err.error) {
// //           console.error('Error message from server:', err.error);
// //         }
// //       },
// //     });
// // }
// fetchMeetings(): void {
//   const token = localStorage.getItem('authToken');
//   if (!token) {
//     console.error('No token found. Redirect to login.');
//     return;
//   }

//   let url = `https://localhost:7050/api/Meeting?period=${this.selectedFilter.toLowerCase()}`;
//   if (this.searchTerm) {
//     url += `&search=${encodeURIComponent(this.searchTerm)}`;
//   }

//   this.http
//     .get<any[]>(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .subscribe({
//       next: (data: any) => {
//         console.log('Meetings fetched successfully:', data);
//         this.meetings = data;
//         this.openSnackBar('Meetings fetched successfully!');
//       },
//       error: (err: any) => {
//         console.error('Error fetching meetings:', err);
//         this.openSnackBar('Error fetching meetings!', 'Close', true);
//       },
//     });
// }
  
  
//   onFilterChange(): void {
//     this.fetchMeetings();
//   }

//   onSearchChange(): void {
//     this.fetchMeetings();
//   }

  
//   leaveMeeting(meetingId: number): void {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       this.http
//         .patch(
//           `https://localhost:7050/api/Meeting/${meetingId}/remove-attendee?action=remove_attendee`,
//           {}, // Empty body for PATCH request
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         .subscribe({
//           next: () => {
//             console.log('Successfully left the meeting.');
//             this.fetchMeetings(); // Refresh the meetings list
//           },
//           error: (err: any) => {
//             console.error('Error leaving meeting:', err);
//           },
//         });
//     } else {
//       console.error('No token found. Unable to leave the meeting.');
//     }
//   }
  

//   addAttendee(meetingId: number, attendeeEmail: string): void {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       const url = `https://localhost:7050/api/Meeting/${meetingId}?action=add_attendee&email=${encodeURIComponent(
//         attendeeEmail
//       )}`;
  
//       this.http
//         .patch(
//           url,
//           {}, // Empty body for PATCH request
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         .subscribe({
//           next: (response: any) => {
//             console.log('Attendee added successfully:', response);
//             this.fetchMeetings(); // Refresh the meetings list or update UI accordingly
//             this.openSnackBar('Attendee added successfully!');
//           },
//           error: (err: any) => {
//             console.error('Error adding attendee:', err);
//             this.openSnackBar('Error adding attendee!', 'Close', true);
//           },
//         });
//     } else {
//       console.error('No token found. Unable to add attendee.');
//       this.openSnackBar('Authentication required!', 'Close', true);
//     }
//   }
  


//   toggleAddAttendee(meetingId: number): void {
//     this.meetings = this.meetings.map((meeting) =>
//       meeting.id === meetingId
//         ? { ...meeting, showInput: !meeting.showInput }
//         : meeting
//     );
//   }
//   dropdownVisible: boolean = false;

//   toggleDropdown() {
//     this.dropdownVisible = !this.dropdownVisible;
//   }


//   switchTab(tabName: string): void {
//     this.currentTab = tabName;
//   }

//   logoutUser(): void {
//     // Remove the auth token from localStorage
//     localStorage.removeItem('authToken');
    
//     // Navigate to the login page
//     this.router.navigate(['/login']);
//     this.openSnackBar('Logged out successfully!', 'Close');

//     console.log('User logged out. Navigated to /login.');
//   }




//   cancelAddAttendee(meetingId: number): void {
//     const meeting = this.meetings.find(m => m.id === meetingId);
//     if (meeting) {
//       meeting.showInput = false; 
//     }
//   }
// }




import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { AddMeetingComponent } from '../../AddMeeting/add-meeting/add-meeting.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MeetingsService } from './meetings.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, AddMeetingComponent, DatePipe, MatSnackBarModule, FontAwesomeModule],  // Include FontAwesomeModule here
})
export class MeetingsComponent implements OnInit {
  meetings: any[] = [];
  faCircleUser = faCircleUser;  // Correctly assign the icon
  filterOptions = ['ALL', 'PAST', 'TODAY', 'UPCOMING'];
  selectedFilter = 'ALL';
  searchTerm = '';
  currentTab = 'filter';
  attendeeEmail: string = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  filteredEmails: string[] = [];

  constructor(
    private meetingsService: MeetingsService, // Inject the service
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchMeetings();
    this.fetchUsers();
  }

  openSnackBar(message: string, action: string = 'Close', isError: boolean = false): void {
    this.snackBar.open(message, action, {
      duration: 5000, // 5 seconds
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: isError ? 'snack-bar-error' : 'snack-bar-success',
    });
  }

  fetchUsers(): void {
    this.meetingsService.fetchUsers().subscribe(
      (users) => {
        this.users = users.map((user) => ({
          name: user.name,
          email: user.email,
        }));
        this.filteredUsers = this.users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchMeetings(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found. Redirect to login.');
      return;
    }

    this.meetingsService.fetchMeetings(token, this.selectedFilter, this.searchTerm).subscribe(
      (data) => {
        console.log('Meetings fetched successfully:', data);
        this.meetings = data;
        this.openSnackBar('Meetings fetched successfully!');
      },
      (error) => {
        console.error('Error fetching meetings:', error);
        this.openSnackBar('Error fetching meetings!', 'Close', true);
      }
    );
  }

  onFilterChange(): void {
    this.fetchMeetings();
  }

  onSearchChange(): void {
    this.fetchMeetings();
  }

  leaveMeeting(meetingId: number): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.meetingsService.leaveMeeting(meetingId, token).subscribe(
        () => {
          console.log('Successfully left the meeting.');
          this.fetchMeetings(); // Refresh the meetings list
        },
        (error) => {
          console.error('Error leaving meeting:', error);
        }
      );
    } else {
      console.error('No token found. Unable to leave the meeting.');
    }
  }

  addAttendee(meetingId: number, attendeeEmail: string): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.meetingsService.addAttendee(meetingId, attendeeEmail, token).subscribe(
        (response) => {
          console.log('Attendee added successfully:', response);
          this.fetchMeetings(); // Refresh the meetings list or update UI accordingly
          this.openSnackBar('Attendee added successfully!');
        },
        (error) => {
          console.error('Error adding attendee:', error);
          this.openSnackBar('Error adding attendee!', 'Close', true);
        }
      );
    } else {
      console.error('No token found. Unable to add attendee.');
      this.openSnackBar('Authentication required!', 'Close', true);
    }
  }

  toggleAddAttendee(meetingId: number): void {
    this.meetings = this.meetings.map((meeting) =>
      meeting.id === meetingId
        ? { ...meeting, showInput: !meeting.showInput }
        : meeting
    );
  }

  logoutUser(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
    this.openSnackBar('Logged out successfully!', 'Close');
    console.log('User logged out. Navigated to /login.');
  }

  cancelAddAttendee(meetingId: number): void {
    const meeting = this.meetings.find((m) => m.id === meetingId);
    if (meeting) {
      meeting.showInput = false;
    }
  }

  selectEmail(meetingId: number, email: string): void {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (meeting) {
      meeting.attendeeEmail = email;  // Set the selected email to the input
      this.filteredEmails = [];  // Clear the suggestions list after selection
    }
  }

  onEmailInput(meetingId: number): void {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (meeting) {
      const query = meeting.attendeeEmail.toLowerCase();
      // Filter emails that match the typed text
      this.filteredEmails = this.users
        .filter(user => user.email.toLowerCase().includes(query))
        .map(user => user.email);
    }
  }

  switchTab(tab: string): void {
    this.currentTab = tab;
  }
}
