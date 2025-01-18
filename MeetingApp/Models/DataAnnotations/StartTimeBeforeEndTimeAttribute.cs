using System;
using System.ComponentModel.DataAnnotations;
using MeetingApp.Models.Domain;

namespace MeetingApp.Validation
{
    public class StartTimeBeforeEndTimeAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var meeting = (Models.Domain.Meetings)validationContext.ObjectInstance;

            if (meeting.StartTime > meeting.EndTime)
            {
                return new ValidationResult("Start time must be on or before the end time.");
            }

            return ValidationResult.Success;
        }
    }
}
