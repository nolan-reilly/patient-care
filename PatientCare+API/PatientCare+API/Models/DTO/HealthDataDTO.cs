using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.DTO
{
    public class HealthDataDTO
    {
        public int GlucoseLevel { get; set; }
        public int HeartRate { get; set; }
        public int BloodSugar { get; set; }
        public string BloodPressure { get; set; } = string.Empty;
        public DateTime DateTime { get; set; }
    }
}
