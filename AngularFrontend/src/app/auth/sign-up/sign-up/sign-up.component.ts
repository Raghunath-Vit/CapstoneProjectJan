// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { HttpClient } from '@angular/common/http';  // Import HttpClient to send HTTP requests
// import { Router } from '@angular/router';  // Import Router for navigation
// import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-signup',
//   templateUrl: './sign-up.component.html',
//   styleUrl: './sign-up.component.scss',  // Corrected to 'styleUrls'
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink,MatSnackBarModule],
// })
// export class SignUpComponent {
//   signUpForm: FormGroup;
//   successMessage: string | null = null;  // To hold success message
//   errorMessage: string | null = null;    // To hold error message

//   constructor(private fb: FormBuilder,private http: HttpClient, private router: Router, private snackBar: MatSnackBar ) {
//     this.signUpForm = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   onSubmit(): void {
//     if (this.signUpForm.valid) {
//       const registerData = this.signUpForm.value;
//       // Make HTTP POST request to register the user
//       this.http.post('https://localhost:7050/api/Users/register', registerData).subscribe({
//         next: (response: any) => {
//           // Success message from backend
//           this.successMessage = response.message;
//           this.errorMessage = null;  // Clear any previous error messages
//           // Redirect after successful registration (optional)
//            // Display success message in snackbar
//            this.snackBar.open(this.successMessage || "User Has Benn Registered", 'Close', {
//             duration: 3000,  // Duration for the snackbar
//             verticalPosition: 'top',
//             horizontalPosition: 'right',
//           });

//           setTimeout(() => {
//             this.router.navigate(['/meetings']); // Navigate to login page after success
//           }, 1000);
//         },
//         error: (err) => {
//           // Handle error response from backend
//           if (err.error && err.error.message) {
//             this.errorMessage = err.error.message; // Display backend error message
//           } else {
//             this.errorMessage = 'An error occurred. Please try again.'; // Fallback error message
//           }
//           this.successMessage = null;  // Clear any previous success messages
//            // Display error message in snackbar
//            this.snackBar.open(this.errorMessage || 'User Registeration Failed', 'Close', {
//             duration: 3000,  // Duration for the snackbar
//             verticalPosition: 'top',
//             horizontalPosition: 'right',
//           });
//           console.error(err);  // Log the error for debugging
//         },
//       });
//     }
//   }
// }



// sign-up.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';  // Import Router for navigation
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MeetingsService } from '../../../services/meetings.service';
@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  successMessage: string | null = null;  // To hold success message
  errorMessage: string | null = null;    // To hold error message

  constructor(
    private fb: FormBuilder,
    private meetingsService: MeetingsService,  // Inject MeetingsService
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const registerData = this.signUpForm.value;

      // Use MeetingsService to handle the registration request
      this.meetingsService.registerUser(registerData).subscribe({
        next: (response) => {
          // Success message from backend
          this.successMessage = response.message;
          this.errorMessage = null;  // Clear any previous error messages
          
          // Display success message in snackbar
          this.snackBar.open(this.successMessage || 'User Has Been Registered', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });



          // Automatically log in the user after registration
          const { email, password } = registerData;
          this.meetingsService.loginUser({ email, password }).subscribe({
            next: (loginResponse) => {
              localStorage.setItem('authToken', loginResponse.token); // Store token
              this.router.navigate(['/meeting']); // Navigate to meetings page
            },
            error: (loginErr) => {
              this.snackBar.open('Login failed after registration. Please log in manually.', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
              });
              console.error(loginErr);
            },
          });





          // Navigate to meetings page after success
          // setTimeout(() => {
          //   this.router.navigate(['/login']);
          // }, 1000);
        },
        error: (err) => {
          // Handle error response from backend
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message; // Display backend error message
          } else {
            this.errorMessage = 'An error occurred. Please try again.'; // Fallback error message
          }
          this.successMessage = null;  // Clear any previous success messages
          
          // Display error message in snackbar
          this.snackBar.open(this.errorMessage || 'User Registration Failed', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });

          console.error(err);  // Log the error for debugging
        },
      });
    }
  }
}
