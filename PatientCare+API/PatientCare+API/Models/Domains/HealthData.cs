using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.Domains
{
    public class HealthData
    {
        public Guid Id { get; set; }  // Unique identifier for the health data entry
        public Guid PatientId { get; set; }  // Information about the patient

        // Glucose level in mg/dL (fasting normal range: 70-99 mg/dL)
        // Min: 0, Max: 500 (extreme upper bound for glucose)
        [Range(0,500, ErrorMessage = "Glucose level must be between 0 and 500 mg/dL.")]
        public int GlucoseLevel { get; set; }

        // Heart rate in beats per minute (bpm) (normal resting: 60-100 bpm)
        // Min: 30, Max: 220 (athlete to maximum effort)
        [Range(30, 250, ErrorMessage = "Heart rate must be between 30 and 250 mg/dL.")]
        public int HeartRate { get; set; }  

        // Blood sugar level in mg/dL (normal fasting range: 70-100 mg/dL)
        [Range(0, 500, ErrorMessage = "Blood sugar must be between 0 and 500 mg/dL.")]
        public int BloodSugar { get; set; }  // Min: 0, Max: 500

        // Blood pressure represented as systolic/diastolic (e.g., "120/80")
        // Represent as string "systolic/diastolic"
        [StringLength(7, ErrorMessage = "Enter blood pressure as fraction (e.g 120/80)", MinimumLength = 5)]
        public string BloodPressure { get; set; } = string.Empty;

        public DateTime DateTime { get; set; }
    }
}
