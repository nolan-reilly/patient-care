using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.Domains
{
    public class PatientPrescriptionData
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Medication { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string StartDate { get; set;} = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public string Remarks { get; set;} = string.Empty;

    }
}
