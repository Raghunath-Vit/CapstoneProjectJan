// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { NavbarComponent } from '../../navbar/navbar.component';

// @Component({
//   selector: 'app-add-meeting',
//   standalone: true,
//   imports: [FormsModule, CommonModule,NavbarComponent],
//   templateUrl: './add-meeting.component.html',
//   styleUrls: ['./add-meeting.component.scss'],
// })
// export class AddMeetingComponent implements OnInit {
//   meeting = {
//     name: '',
//     date: '',
//     startTime: { hours: 0, minutes: 0 },
//     endTime: { hours: 0, minutes: 0 },
//     description: '',
//     attendees: [] as string[], // Email IDs
//   };

//   users: { name: string; email: string }[] = [];
//   filteredUsers: { name: string; email: string }[] = [];
//   attendeeInput = ''; // Used for attendee input field

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchUsers();
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
  


//   searchUsers(searchTerm: string) {
//     this.filteredUsers = this.users.filter((user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }

//   selectAttendee(email: string) {
//     if (!this.meeting.attendees.includes(email)) {
//       this.meeting.attendees.push(email);
//     }
//     this.attendeeInput = ''; // Clear the input field
//   }

//   removeAttendee(email: string) {
//     this.meeting.attendees = this.meeting.attendees.filter((att) => att !== email);
//   }

//   addMeeting() {
//     if (!this.meeting.name || !this.meeting.date || !this.meeting.description || !this.meeting.attendees.length) {
//       alert('Please fill all required fields.');
//       return;
//     }

//     const payload = {
//       name: this.meeting.name,
//       description: this.meeting.description,
//       date: this.meeting.date,
//       startTime: this.convertTime(this.meeting.startTime),
//       endTime: this.convertTime(this.meeting.endTime),
//       attendees: this.meeting.attendees,
//     };

//     console.log('Payload:', payload);

//         this.http.post('https://localhost:7050/api/Users/meetings', payload).subscribe(
//       (response) => {
//         alert('Meeting added successfully!');
//         this.resetForm();
//       },
//       (error) => {
//         console.error('Error adding meeting:', error);
//         alert('Failed to add meeting. Check console for details.');
//       }
//     );
//   }

//   convertTime(time: any) {
//     const [hours, minutes] = time.split(':').map(Number);
//     return { hours, minutes };
//   }

//   resetForm() {
//     this.meeting = {
//       name: '',
//       date: '',
//       startTime: { hours: 0, minutes: 0 },
//       endTime: { hours: 0, minutes: 0 },
//       description: '',
//       attendees: [],
//     };
//     this.attendeeInput = '';
//     this.filteredUsers = this.users;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { MeetingsService } from '../../meetings/meetings/meetings.service'; // Import the service
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-add-meeting',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.scss'],
})
export class AddMeetingComponent implements OnInit {
  meeting = {
    name: '',
    date: '',
    startTime: { hours: 0, minutes: 0 },
    endTime: { hours: 0, minutes: 0 },
    description: '',
    attendees: [] as string[], // Email IDs
  };

  users: { name: string; email: string }[] = [];
  filteredUsers: { name: string; email: string }[] = [];
  attendeeInput = ''; // Used for attendee input field

  constructor(private meetingsService: MeetingsService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.meetingsService.fetchUsers().subscribe(
      (users) => {
        // Directly map the users from the response
        this.users = users.map(user => ({
          name: user.name,
          email: user.email,
        }));

        // Initialize filteredUsers with the full user list
        this.filteredUsers = this.users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  searchUsers(searchTerm: string) {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  selectAttendee(email: string) {
    if (!this.meeting.attendees.includes(email)) {
      this.meeting.attendees.push(email);
    }
    this.attendeeInput = ''; // Clear the input field
  }

  removeAttendee(email: string) {
    this.meeting.attendees = this.meeting.attendees.filter((att) => att !== email);
  }

  addMeeting() {
    if (!this.meeting.name || !this.meeting.date || !this.meeting.description || !this.meeting.attendees.length) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      name: this.meeting.name,
      description: this.meeting.description,
      date: this.meeting.date,
      startTime: this.convertTime(this.meeting.startTime),
      endTime: this.convertTime(this.meeting.endTime),
      attendees: this.meeting.attendees,
    };

    console.log('Payload:', payload);

    this.meetingsService.addMeeting(payload).subscribe(
      (response) => {
        alert('Meeting added successfully!');
        this.resetForm();
      },
      (error) => {
        console.error('Error adding meeting:', error);
        alert('Failed to add meeting. Check console for details.');
      }
    );
  }

  convertTime(time: any) {
    const [hours, minutes] = time.split(':').map(Number);
    return { hours, minutes };
  }

  resetForm() {
    this.meeting = {
      name: '',
      date: '',
      startTime: { hours: 0, minutes: 0 },
      endTime: { hours: 0, minutes: 0 },
      description: '',
      attendees: [],
    };
    this.attendeeInput = '';
    this.filteredUsers = this.users;
  }
}
