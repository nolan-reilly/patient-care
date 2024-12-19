using PatientCare_API.Models.Domains;

namespace PatientCare_API.Models.DTO
{
    public class PatientPrescriptionRequest
    {
        public PatientPrescriptionData? PatientPrescriptionData { get; set; }
        public string PatientEmail { get; set; } = string.Empty;
    }
}
