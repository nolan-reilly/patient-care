namespace PatientCare_API.Models.Domains
{
    public class PatientDoctor
    {
        public Guid Id { get; set; }
        public Guid PatientID { get; set; }
        public Guid DoctorID { get; set; }
    }
}
