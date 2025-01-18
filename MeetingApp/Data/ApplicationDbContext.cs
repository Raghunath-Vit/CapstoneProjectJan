using MeetingApp.Models.Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace MeetingApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Users> Users { get; set; }
        public DbSet<Meetings> Meetings { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed data for Users
            var users = new List<Users>
            {
                new Users
                {
                    Id = 1,
                    Username = "JohnDoe",
                    Email = "johndoe@example.com",
                    PasswordHash = "hashedpassword123" // Replace with a hashed value
                },
                new Users
                {
                    Id = 2,
                    Username = "JaneSmith",
                    Email = "janesmith@example.com",
                    PasswordHash = "hashedpassword456" // Replace with a hashed value
                }
            };

            // Seed data for Meetings
            var meetings = new List<Meetings>
            {
                new Meetings
                {
                    Id = 1,
                    Name = "Team Sync",
                    Date = DateTime.Now.Date,
                    StartTime = new TimeSpan(9, 0, 0),
                    EndTime = new TimeSpan(10, 0, 0),
                    Description = "Weekly team sync to discuss ongoing tasks and blockers.",
                    Attendees = "" // For a comma-separated string
                    // Attendees are not persisted in the database, so this property is not included in seed data
                },
                new Meetings
                {
                    Id = 2,
                    Name = "Project Kickoff",
                    Date = DateTime.Now.AddDays(1).Date,
                    StartTime = new TimeSpan(14, 0, 0),
                    EndTime = new TimeSpan(15, 30, 0),
                    Description = "Initial meeting to discuss project goals, scope, and timelines.",
                    Attendees = "", // For a comma-separated string
                }
            };

            // Configure the entities
            modelBuilder.Entity<Users>().HasData(users);
            modelBuilder.Entity<Meetings>().HasData(meetings);
        }
    }
}


