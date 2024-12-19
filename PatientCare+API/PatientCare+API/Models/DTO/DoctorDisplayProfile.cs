using PatientCare_API.Models.Domains;
using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.DTO
{
    public class DoctorDisplayProfile : Account
    {
        public string Specialization { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;

        public Guid? DoctorOffice;
    }
}
