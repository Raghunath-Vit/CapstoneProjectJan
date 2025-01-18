// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule,RouterLink],
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   errorMessage: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       const loginData = this.loginForm.value;
//       this.http.post('https://localhost:7050/api/Users/login', loginData).subscribe({
//         next: (response: any) => {
//           const { token, message, name } = response;
//           localStorage.setItem('authToken', token); // Save token to localStorage
//           // alert(`${message}, Welcome ${name}!`);
//           this.router.navigate(['/meetings']); // Navigate to Meetings page
//         },
//         error: (err) => {
//           // Handle the error message coming from the backend
//           if (err.error && err.error.message) {
//             this.errorMessage = err.error.message; // Display backend error message
//           } else {
//             this.errorMessage = 'An error occurred. Please try again.'; // Fallback error message
//           }
//           console.error(err); // Log error to the console for debugging
//         },
//       });
//     }
//   }
// }



// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeetingsService } from '../../../services/meetings.service'; // Import MeetingsService
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,MatSnackBarModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private meetingsService: MeetingsService,  // Inject MeetingsService
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.meetingsService.loginUser(loginData).subscribe({
        next: (response) => {
          const { token, message, name } = response;
          localStorage.setItem('authToken', token); // Save token to localStorage
          // alert(${message}, Welcome ${name}!);
          // Display the backend message in the snackbar if available, otherwise a general success message
          this.snackBar.open(message || `Welcome ${name}!`, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
          this.router.navigate(['/meetings']); // Navigate to Meetings page
        },
        error: (err) => {
          // Handle the error message coming from the backend
          const backendMessage = err.error && err.error.message ? err.error.message : 'An error occurred. Please try again.';
          // Display error message in the snackbar
          this.snackBar.open(backendMessage, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
          // Handle the error message coming from the backend
          // if (err.error && err.error.message) {
          //   this.errorMessage = err.error.message; // Display backend error message
          // } else {
          //   this.errorMessage = 'An error occurred. Please try again.'; // Fallback error message
          // }
          console.error(err); // Log error to the console for debugging
        },
      });
    }
  }
}
