using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MeetingApp.Models.Domain
{
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        
        [MinLength(3)]
        public string Username { get; set; }


        [Required(ErrorMessage = "Please Provide Valid Email")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        [Required(ErrorMessage ="Please Provide Valid Password")]
        //public string Password { get; set; }
        public string PasswordHash { get; set; }

    }
}
