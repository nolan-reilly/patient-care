using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.Domains
{
    public class DoctorNoteData
    {
        public Guid Id { get; set; }
        public Guid DoctorId { get; set; }
        public Guid PatientID { get; set; }
        public string NoteToPatient { get; set; } = string.Empty;
    }
}
