using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Routing.Template;
using Microsoft.EntityFrameworkCore;
using PatientCare_API.Models.Domains;

namespace PatientCare_API.Data
{
    public class PatientCarePlusDbContext : IdentityDbContext<IdentityUser>
    {
        public PatientCarePlusDbContext(DbContextOptions dbContextOptions): base(dbContextOptions)
        {
            
        }

        public DbSet<PatientAccount> PatientAccounts { get; set; }
        public DbSet<DoctorAccount> DoctorAccounts { get; set; }
        public DbSet<HealthData> HealthData { get; set; }
        public DbSet<DoctorOffice> DoctorOffices { get; set; }
        public DbSet<PatientDoctor> PatientDoctors { get; set; }
        public DbSet<UrgentCareData> UrgentCareData { get; set; }
        public DbSet<PatientPrescriptionData> PatientPrescriptionData { get; set; }
        public DbSet<DoctorNoteData> PatientDoctorNotes { get; set; }
    }
}
