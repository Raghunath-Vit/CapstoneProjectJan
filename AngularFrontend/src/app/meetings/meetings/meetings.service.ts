// // import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// // import { Injectable } from '@angular/core';
// // import { Observable } from 'rxjs';

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class MeetingsService {
// //   private baseUrl = 'https://localhost:7050/api/Meeting';  // Updated URL for .NET backend

// //   constructor(private http: HttpClient) {}

// //   // Create headers with the authorization token
// //   private getHeaders(): HttpHeaders {
// //     const token = localStorage.getItem('authToken');
// //     return new HttpHeaders({
// //       Authorization: `Bearer ${token}`,  // Make sure to include 'Bearer'
// //       'Content-Type': 'application/json',
// //     });
// //   }

// //   // Fetch meetings from .NET API with optional filtering and search term
// //   getMeetings(period: string = 'ALL', searchTerm: string = ''): Observable<any> {
// //     const params = new HttpParams()
// //       .set('period', period)
// //       .set('search', searchTerm);

// //     return this.http.get<any>(`${this.baseUrl}`, {
// //       headers: this.getHeaders(),
// //       params,
// //     });
// //   }

// //   // Leave a meeting
// //   leaveMeeting(meetingId: string): Observable<any> {
// //     const url = `${this.baseUrl}/${meetingId}`;
// //     return this.http.patch<any>(
// //       url,
// //       { action: 'leave' },
// //       { headers: this.getHeaders() }
// //     );
// //   }

// //   // Add attendee to a meeting
// //   addAttendee(meetingId: string): Observable<any> {
// //     const url = `${this.baseUrl}/${meetingId}/attendees`;
// //     return this.http.post<any>(
// //       url,
// //       {},
// //       { headers: this.getHeaders() }
// //     );
// //   }
// // }


// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class MeetingsService {
//   private baseUrl = 'https://localhost:7050/api/Meeting'; // Updated API base URL

//   constructor(private http: HttpClient) {}

//   // Create headers with the authorization token
//   private getHeaders(): HttpHeaders {
//     const token = localStorage.getItem('authToken');
//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     });
//   }

//   // Fetch meetings from the .NET API with optional filtering and search term
//   getMeetings(period: string = 'ALL', searchTerm: string = ''): Observable<any> {
//     const params = new HttpParams()
//       .set('period', period)
//       .set('search', searchTerm);

//     return this.http.get<any>(`${this.baseUrl}`, {
//       headers: this.getHeaders(),
//       params,
//     });
//   }

//   // Add attendee to a meeting
//   addAttendee(meetingId: number, email: string): Observable<any> {
//     const url = `${this.baseUrl}/${meetingId}`;
//     const params = new HttpParams()
//       .set('action', 'add_attendee')
//       .set('email', email);

//     return this.http.patch<any>(
//       url,
//       null,
//       { headers: this.getHeaders(), params }
//     );
//   }

//   // Remove attendee from a meeting
//   removeAttendee(meetingId: number, email: string): Observable<any> {
//     const url = `${this.baseUrl}/${meetingId}`;
//     const params = new HttpParams()
//       .set('action', 'remove_attendee')
//       .set('email', email);

//     return this.http.patch<any>(
//       url,
//       null,
//       { headers: this.getHeaders(), params }
//     );
//   }

//   // Create a new meeting
//   createMeeting(meetingData: any): Observable<any> {
//     const url = 'https://localhost:7050/api/Users/meetings';
//     return this.http.post<any>(url, meetingData, {
//       headers: this.getHeaders(),
//     });
//   }
// }


// // import { Injectable } from '@angular/core';
// // import { HttpClient, HttpHeaders } from '@angular/common/http';
// // import {jwtDecode} from 'jwt-decode';
// // import { Observable } from 'rxjs';

// // interface DecodedToken {
// //   Id: string;
// //   Name: string;
// //   Email: string;
// //   sub: string;
// //   exp: number;
// //   iss: string;
// //   aud: string;
// // }

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class MeetingService {
// //   private apiUrl = 'https://localhost:7050/api/Meeting/all';

// //   constructor(private http: HttpClient) {}

// //   // Decode the token from localStorage
// //   decodeToken(): DecodedToken | null {
// //     const token = localStorage.getItem('authToken');
// //     if (!token) {
// //       console.error('No token found in localStorage.');
// //       return null;
// //     }

// //     try {
// //       return jwtDecode<DecodedToken>(token);
// //     } catch (error) {
// //       console.error('Error decoding token:', error);
// //       return null;
// //     }
// //   }

// //   // Fetch meetings from the backend
// //   fetchMeetings(): Observable<any[]> {
// //     const token = localStorage.getItem('authToken');

// //     if (!token) {
// //       console.error('No token found. Redirecting to login.');
// //       return new Observable<any[]>((observer) => {
// //         observer.error('Unauthorized: No token found.');
// //       });
// //     }

// //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

// //     return this.http.get<any[]>(this.apiUrl, { headers });
// //   }
// // }




import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  private apiUrl = 'https://localhost:7050/api/Meeting';
  private newApiUrl = 'https://localhost:7050/api/Users/meetings'
  private usersApiUrl = 'https://localhost:7050/api/Users/getalluser';
  private loginUrl = 'https://localhost:7050/api/Users/login';
  private registerUrl = 'https://localhost:7050/api/Users/register';

  constructor(private http: HttpClient) {}

  fetchMeetings(token: string, filter: string, searchTerm: string): Observable<any[]> {
    let url = `${this.apiUrl}?period=${filter.toLowerCase()}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any[]>(url, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.usersApiUrl);
  }

  addAttendee(meetingId: number, attendeeEmail: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/${meetingId}?action=add_attendee&email=${encodeURIComponent(attendeeEmail)}`;
    return this.http.patch(url, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  leaveMeeting(meetingId: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/${meetingId}/remove-attendee?action=remove_attendee`;
    return this.http.patch(url, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  addMeeting(payload: any): Observable<any> {
    return this.http.post(`${this.newApiUrl}`, payload);
  }

  loginUser(loginData: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, loginData);
  }

  registerUser(registerData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, registerData);
  }
}
