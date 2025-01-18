// import { Component, EventEmitter, Output } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.scss'
// })
// export class NavbarComponent {
//   currentTab = 'filter';

//   @Output() tabChanged = new EventEmitter<string>();

//   constructor(private router: Router) {}

//   switchTab(tab: string) {
//     this.currentTab = tab;
//     this.tabChanged.emit(tab);  // Notify parent component of the tab change
//   }

//   logout() {
//     localStorage.removeItem('authToken'); // Log out by removing token
//     this.router.navigate(['/login']); // Navigate to the login page
//   }
// }
