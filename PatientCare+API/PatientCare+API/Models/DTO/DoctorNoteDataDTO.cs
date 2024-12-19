namespace PatientCare_API.Models.DTO
{
    public class DoctorNoteDataDTO
    {
        public Guid DoctorID { get; set; }
        public DoctorProfile? DoctorProfile { get; set; }
        public string PatientEmail { get; set; } = string.Empty;
        public string NoteToPatient { get; set; } = string.Empty;
    }
}
