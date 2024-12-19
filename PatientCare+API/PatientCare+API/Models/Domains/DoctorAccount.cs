using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.Domains
{
    public class DoctorAccount : Account
    {
        [Required]
        [StringLength(50, ErrorMessage = "Please give your specialization.")]
        public string Specialization { get; set; } = string.Empty;

        [Required]
        [StringLength(10, ErrorMessage = "The LicenseNumber must be {10} characters long.", MinimumLength = 10)]
        public string LicenseNumber { get; set; } = string.Empty;

        public Guid? DoctorOffice;
    }
}
