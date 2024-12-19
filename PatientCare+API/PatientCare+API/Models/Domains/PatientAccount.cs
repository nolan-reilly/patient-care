using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.Domains
{
    public class PatientAccount : Account
    {
        public string? InsuranceProvider { get; set; }

        public string? InsuranceIdentificationNumber { get; set; }

    }
}
