using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.Domains
{
    public class DoctorOffice
    {
        public Guid Id { get; set; }

        public List<DoctorAccount>? Doctors { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Clinic Name cannot be more than 100 characters long")]
        public string ClinicName { get; set; } = string.Empty;

        public string? City { get; set; }

        public string? State { get; set; }

        public int? ZipCode {  get; set; }

        public string? Address { get; set; }

        [Required]
        public string Country { get; set; } = string.Empty;

    }
}
