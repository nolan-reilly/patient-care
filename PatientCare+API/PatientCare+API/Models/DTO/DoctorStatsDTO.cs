namespace PatientCare_API.Models.DTO
{
    public class DoctorStatsDTO
    {
        public int TotalReportSent { get; set; }
        public int NumberOfClients { get; set; }
        public int NumberOfUrgentCareClients { get; set; }
    }
}
