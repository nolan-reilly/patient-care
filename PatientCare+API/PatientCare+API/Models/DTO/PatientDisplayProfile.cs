using System.ComponentModel.DataAnnotations;
using PatientCare_API.Models.Domains;

namespace PatientCare_API.Models.DTO
{
    public class PatientDisplayProfile : Account
    {
        public string? InsuranceProvider { get; set; }
        public string? InsuranceIdentificationNumber { get; set; }
    }
}
