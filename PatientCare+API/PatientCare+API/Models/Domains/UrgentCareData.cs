namespace PatientCare_API.Models.Domains
{
    public class UrgentCareData
    {
        public Guid Id { get; set; }
        public Guid DoctorID { get; set; }
        public Guid PatientID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
