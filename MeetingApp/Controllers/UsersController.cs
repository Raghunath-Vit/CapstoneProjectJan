
using MeetingApp.Data;
using MeetingApp.Models.Domain;
using MeetingApp.Models.DTO;
using MeetingApp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace MeetingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public UsersController(ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Hash the password
            var hashedPassword = PasswordHelper.HashPassword(userDto.Password);
            Console.WriteLine($"Password: {userDto.Password}");
            Console.WriteLine($"Hashed Password: {hashedPassword}");

            // Check if email already exists
            var existingUser = _dbContext.Users.FirstOrDefault(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return Conflict(new { Message = "Email already in use." });
            }

            // Create a new user
            var user = new Users
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = hashedPassword
            };

            // Save to the database
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully!" });
        }






       
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user exists
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            // Verify password
            if (!PasswordHelper.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            // Create token
            var token = GenerateJwtToken(user);
            return Ok(new { Message = "Login successful!", Token = token });
        }



        // Get all users - only accessible by authenticated users
        [HttpGet("getalluser")]
        [Authorize]  // Apply the [Authorize] attribute
        public IActionResult GetAllUsers()
        {
            var users = _dbContext.Users
                .Select(u => new
                {
                    _id = u.Id.ToString(),  // Convert Id to string
                    name = u.Username,
                    email = u.Email
                })
                .ToList();

            return Ok(users);
        }






        [HttpPost("meetings")]
        [Authorize]
        public async Task<IActionResult> CreateMeeting([FromBody] MeetingDto meetingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Decode JWT token to get the logged-in user's email
            var loggedInUserEmail = User.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

            if (loggedInUserEmail == null)
            {
                return Unauthorized(new { Message = "Unable to identify the logged-in user." });
            }

            // Ensure the logged-in user's email is included in attendees
            if (!meetingDto.Attendees.Contains(loggedInUserEmail))
            {
                meetingDto.Attendees.Add(loggedInUserEmail);
            }



            // Validate the meeting date
            if (meetingDto.Date < DateTime.UtcNow.Date)
            {
                return BadRequest(new { Message = "Meeting date cannot be in the past." });
            }

            // Validate the meeting time
            var startTime = new TimeSpan(meetingDto.StartTime.Hours, meetingDto.StartTime.Minutes, 0);
            var endTime = new TimeSpan(meetingDto.EndTime.Hours, meetingDto.EndTime.Minutes, 0);

            if (startTime >= endTime)
            {
                return BadRequest(new { Message = "Meeting start time must be before the end time." });
            }




            // Map the DTO to a Meeting entity
            var meeting = new Meetings
            {
                Name = meetingDto.Name,
                Description = meetingDto.Description,
                Date = meetingDto.Date,
                StartTime = new TimeSpan(meetingDto.StartTime.Hours, meetingDto.StartTime.Minutes, 0),
                EndTime = new TimeSpan(meetingDto.EndTime.Hours, meetingDto.EndTime.Minutes, 0),
                Attendees = string.Join(",", meetingDto.Attendees) // Store as a comma-separated string
            };

            // Save the meeting to the database
            _dbContext.Meetings.Add(meeting);
            await _dbContext.SaveChangesAsync();


            // Return the response with the meeting ID and message
            return Ok(new { Message = "Meeting created successfully!", MeetingId = meeting.Id });
        }








        private string GenerateJwtToken(Users user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();

            var claims = new[]
            {
                new Claim("Id", user.Id.ToString()),
                new Claim("Name", user.Username),
                new Claim("Email", user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
        };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey));
            var issuer2 = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Issuer"]));
            var audience2 = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Audience"]));
            var issuer = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Issuer));
            var audience = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Audience));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["JwtSettings:Issuer"],
                _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(10),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
