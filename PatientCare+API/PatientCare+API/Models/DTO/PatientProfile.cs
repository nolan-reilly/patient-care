using PatientCare_API.Models.Domains;

namespace PatientCare_API.Models.DTO
{
    public class PatientProfile
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Age { get; set; }
        public List<HealthDataDTO>? HealthData { get; set; }
        public List<PatientPrescriptionData>? PatientPrescriptionData { get; set; }
        public List<DoctorNoteDataDTO>? DoctorNoteData { get; set; }
    }
}
