namespace MeetingApp.Models.DTO;
public class MeetingDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public TimeDto StartTime { get; set; }
    public TimeDto EndTime { get; set; }
    public List<string> Attendees { get; set; } = new List<string>();
}

public class TimeDto
{
    public int Hours { get; set; }
    public int Minutes { get; set; }
}
