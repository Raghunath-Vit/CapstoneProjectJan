using MeetingApp.Data;
using MeetingApp.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using MeetingApp.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace MeetingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MeetingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MeetingController(ApplicationDbContext context)
        {
            _context = context;
        }



        //[HttpGet("all")]
        //public IActionResult GetAllMeetings()
        //{
        //    // Extract the logged-in user's email from the JWT token
        //    var loggedInUserEmail = User.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

        //    if (string.IsNullOrEmpty(loggedInUserEmail))
        //    {
        //        return Unauthorized(new { Message = "Unable to identify the logged-in user." });
        //    }

        //    // Fetch all meetings and filter in memory
        //    var meetings = _context.Meetings
        //        .AsEnumerable() // Fetch all meetings into memory
        //        .Where(m => !string.IsNullOrEmpty(m.Attendees) && m.Attendees.Split(',').Contains(loggedInUserEmail))
        //        .ToList();

        //    // Map to DTO
        //    var meetingDtos = meetings.Select(m => new MeetingDto
        //    {
        //        Id = m.Id,  // Add the MeetingId to the DTO
        //        Name = m.Name,
        //        Description = m.Description,
        //        Date = m.Date,
        //        StartTime = new TimeDto
        //        {
        //            Hours = m.StartTime.Hours,
        //            Minutes = m.StartTime.Minutes
        //        },
        //        EndTime = new TimeDto
        //        {
        //            Hours = m.EndTime.Hours,
        //            Minutes = m.EndTime.Minutes
        //        },
        //        Attendees = m.Attendees.Split(',').ToList() // Convert stored string to a list
        //    }).ToList();

        //    return Ok(meetingDtos);
        //}

        [HttpGet("all")]
        public IActionResult GetAllMeetings()
        {
            // Step 1: Extract the Authorization header
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader == null || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { Message = "Missing or invalid Authorization header." });
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            // Step 2: Decode the JWT token
            var jwtHandler = new JwtSecurityTokenHandler();
            if (!jwtHandler.CanReadToken(token))
            {
                return Unauthorized(new { Message = "Invalid token format." });
            }

            var jwtToken = jwtHandler.ReadJwtToken(token);

            // Step 3: Extract the email claim
            var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email");
            if (emailClaim == null)
            {
                return Unauthorized(new { Message = "Email claim is missing in the token." });
            }

            var loggedInUserEmail = emailClaim.Value;

            // Step 4: Fetch meetings for the logged-in user
            var meetings = _context.Meetings
                .AsEnumerable()
                .Where(m => !string.IsNullOrEmpty(m.Attendees) && m.Attendees.Split(',').Contains(loggedInUserEmail))
                .ToList();

            // Step 5: Map to DTO
            var meetingDtos = meetings.Select(m => new MeetingDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Date = m.Date,
                StartTime = new TimeDto
                {
                    Hours = m.StartTime.Hours,
                    Minutes = m.StartTime.Minutes
                },
                EndTime = new TimeDto
                {
                    Hours = m.EndTime.Hours,
                    Minutes = m.EndTime.Minutes
                },
                Attendees = m.Attendees.Split(',').ToList()
            }).ToList();

            return Ok(meetingDtos);
        }





        [HttpPatch("{id}")]
        public IActionResult UpdateMeetingAttendees(int id, [FromQuery] string action, [FromQuery] string email)
        {
            // Validate action
            if (string.IsNullOrEmpty(action) || action != "add_attendee")
            {
                return BadRequest(new { Message = "Invalid action specified." });
            }

            // Validate email
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { Message = "Email cannot be empty." });
            }

            // Find the meeting by ID
            var meeting = _context.Meetings.FirstOrDefault(m => m.Id == id);
            if (meeting == null)
            {
                return NotFound(new { Message = "Meeting not found." });
            }

            // Check if the attendee already exists
            var attendees = string.IsNullOrEmpty(meeting.Attendees)
                ? new List<string>()
                : meeting.Attendees.Split(',').ToList();

            if (attendees.Contains(email))
            {
                return BadRequest(new { Message = "Attendee already exists in the meeting." });
            }

            // Add the attendee and update the meeting
            attendees.Add(email);
            meeting.Attendees = string.Join(",", attendees);

            // Save changes to the database
            _context.SaveChanges();

            return Ok(new { Message = "Attendee added successfully.", Meeting = meeting });
        }




        [HttpPatch("{id}/remove-attendee")]
        [Authorize]
        public async Task<IActionResult> RemoveAttendeeFromMeeting(int id, [FromQuery] string action)
        {
            // Ensure the 'action' query parameter is 'remove_attendee'
            if (action != "remove_attendee")
            {
                return BadRequest(new { Message = "Invalid action." });
            }

            // Extract the logged-in user's email from the JWT token
            var loggedInUserEmail = User.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

            if (string.IsNullOrEmpty(loggedInUserEmail))
            {
                return Unauthorized(new { Message = "Unable to identify the logged-in user." });
            }

            // Fetch the meeting by ID
            var meeting = await _context.Meetings.FindAsync(id);

            if (meeting == null)
            {
                return NotFound(new { Message = "Meeting not found." });
            }

            // Split the attendees string into a list and check if the user is an attendee
            var attendeesList = meeting.Attendees?.Split(',').ToList() ?? new List<string>();

            if (!attendeesList.Contains(loggedInUserEmail))
            {
                return BadRequest(new { Message = "User is not an attendee of this meeting." });
            }

            // Remove the logged-in user from the attendees list
            attendeesList.Remove(loggedInUserEmail);

            // Update the attendees field with the modified list
            meeting.Attendees = string.Join(",", attendeesList);

            // Save the changes to the database
            _context.Meetings.Update(meeting);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Attendee removed successfully." });
        }


        [HttpGet]
        public async Task<IActionResult> GetFilteredMeetings([FromQuery] string period = "all", [FromQuery] string search = "")
        {
            var loggedInUserEmail = User.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

            if (string.IsNullOrEmpty(loggedInUserEmail))
            {
                return Unauthorized(new { Message = "Unable to identify the logged-in user." });
            }

            var currentDate = DateTime.UtcNow;

            // Fetch meetings from DB and filter further in memory
            var meetings = _context.Meetings
                .Where(m => !string.IsNullOrEmpty(m.Attendees))
                .AsEnumerable()
                .Where(m => m.Attendees.Split(',').Contains(loggedInUserEmail));

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                meetings = meetings.Where(m => m.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                                               m.Description.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            // Apply period filter
            meetings = period.ToLower() switch
            {
                "today" => meetings.Where(m => m.Date.Date == currentDate.Date),
                "upcoming" => meetings.Where(m => m.Date > currentDate),
                "past" => meetings.Where(m => m.Date < currentDate),
                _ => meetings
            };

            var meetingDtos = meetings
                .OrderBy(m => m.Date)
                .Select(m => new MeetingDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Date = m.Date,
                    StartTime = new TimeDto
                    {
                        Hours = m.StartTime.Hours,
                        Minutes = m.StartTime.Minutes
                    },
                    EndTime = new TimeDto
                    {
                        Hours = m.EndTime.Hours,
                        Minutes = m.EndTime.Minutes
                    },
                    Attendees = m.Attendees.Split(',').ToList()
                })
                .ToList();

            return Ok(meetingDtos);
        }




    }
}
