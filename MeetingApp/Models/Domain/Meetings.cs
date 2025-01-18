//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//using MeetingApp.Validation;

//namespace MeetingApp.Models.Domain
//{
//    [StartTimeBeforeEndTime(ErrorMessage = "End Time Must be after the Start Time")]
//    public class Meetings
//    {
//        [Key]
//        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//        public int Id { get; set; }

//        [Required]
//        [MaxLength(100)]
//        public string Name { get; set; }

//        [Required]
//        public DateTime Date { get; set; }

//        [Required]
//        public TimeSpan StartTime { get; set; }

//        [Required]
//        public TimeSpan EndTime { get; set; }

//        [Required]
//        [MaxLength(500)]
//        public string Description { get; set; }

//        [NotMapped]
//        public List<string> Attendees { get; set; } = new List<string>();


//    }
//}


//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//using MeetingApp.Validation;
//using System.Text.Json;

//namespace MeetingApp.Models.Domain
//{
//    [StartTimeBeforeEndTime(ErrorMessage = "End Time must be after the Start Time")]
//    public class Meetings
//    {
//        [Key]
//        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//        public int Id { get; set; }

//        [Required]
//        [MaxLength(100)]
//        public string Name { get; set; }

//        [Required]
//        public DateTime Date { get; set; }

//        [Required]
//        public TimeSpan StartTime { get; set; }

//        [Required]
//        public TimeSpan EndTime { get; set; }

//        [Required]
//        [MaxLength(500)]
//        public string Description { get; set; }

//        // Store attendees as a JSON string
//        [Required]
//        public string Attendees { get; set; } = "[]"; // Initialize with an empty array

//        [NotMapped]
//        public List<string> AttendeesList
//        {
//            get => string.IsNullOrEmpty(Attendees)
//                ? new List<string>()
//                : JsonSerializer.Deserialize<List<string>>(Attendees);
//            set => Attendees = JsonSerializer.Serialize(value);
//        }
//    }
//}



//using System.ComponentModel.DataAnnotations.Schema;
//using System.ComponentModel.DataAnnotations;
//using System.Text.Json;

//namespace MeetingApp.Models.Domain;
//public class Meetings
//{
//    [Key]
//    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//    public int Id { get; set; }

//    [Required]
//    [MaxLength(100)]
//    public string Name { get; set; }

//    [Required]
//    public DateTime Date { get; set; }

//    [Required]
//    public TimeSpan StartTime { get; set; }

//    [Required]
//    public TimeSpan EndTime { get; set; }

//    [Required]
//    [MaxLength(500)]
//    public string Description { get; set; }

//    // Store attendees as a JSON string, initialize with an empty array
//    [Required]
//    public string Attendees { get; set; } = "[]"; // Default value as an empty array

//    [NotMapped]
//    public List<string> AttendeesList
//    {
//        get
//        {
//            // Safely deserialize the JSON string to a list
//            try
//            {
//                return string.IsNullOrEmpty(Attendees)
//                    ? new List<string>()
//                    : JsonSerializer.Deserialize<List<string>>(Attendees);
//            }
//            catch
//            {
//                return new List<string>(); // Return an empty list if deserialization fails
//            }
//        }
//        set
//        {
//            // Serialize the list to JSON string
//            Attendees = JsonSerializer.Serialize(value);
//        }
//    }
//}


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeetingApp.Models.Domain;
public class Meetings
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Attendees { get; set; } // Stored as a comma-separated string
}
