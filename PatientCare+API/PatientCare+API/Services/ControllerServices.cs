using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PatientCare_API.Data;
using PatientCare_API.Models.Domains;
using PatientCare_API.Models.DTO;

namespace PatientCare_API.Services
{
    public class ControllerServices
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly PatientCarePlusDbContext _dbcontext;
        public ControllerServices(UserManager<IdentityUser> userManager, PatientCarePlusDbContext dbContext)
        {
            _userManager = userManager;
            _dbcontext = dbContext;
        }

        public Guid FindPatientIdAsync(string username)
        {
            var _patient = _dbcontext.PatientAccounts.FirstOrDefault(x => x.Email.Equals(username));   // find patient 
            if (_patient == null)
            {
                Console.WriteLine($"Error in finding Patient {username}");
                return Guid.Empty;
            }

            return _patient.Id;

        }

        public LoginDTO? GetPatientLoginInfo(string username)
        {
            var _patient = _dbcontext.PatientAccounts.FirstOrDefault(x => x.Email.Equals(username)); 
            if (_patient == null)
            {
                Console.WriteLine($"Error in finding Patient {username}");
                return null;
            }

            return (new LoginDTO()
            {
                FirstName = _patient.FirstName,
                LastName = _patient.LastName
            });

        }

        public LoginDTO? GetDoctorLoginInfo(string username)
        {
            var _doctor = _dbcontext.DoctorAccounts.FirstOrDefault(x => x.Email.Equals(username));
            if (_doctor == null)
            {
                Console.WriteLine($"Error in finding Patient {username}");
                return null;
            }

            return (new LoginDTO()
            {
                FirstName = _doctor.FirstName,
                LastName = _doctor.LastName
            });

        }
        // CALLED BY DOCTOR SERVER
        public Guid FindDoctorId(string username)
        {
            var _doctorAcc = _dbcontext.DoctorAccounts.FirstOrDefault(x => x.Email.Equals(username));   // find doctor 
            if (_doctorAcc == null)
            {
                Console.WriteLine($"Error in finding Patient {username}");
                return Guid.Empty;
            }

            return _doctorAcc.Id;

        }

        // CALLED BY PATIENT SERVER
        public Guid FindDoctorId(DoctorProfile doctorProfile)
        {
            try
            {
                var _docAccount = _dbcontext.DoctorAccounts
                    .FirstOrDefault(x => x.FirstName == doctorProfile.FirstName &&
                                         x.LastName == doctorProfile.LastName &&
                                         x.Email == doctorProfile.Email &&
                                         x.Specialization == doctorProfile.Specialization);

                if (_docAccount != null)
                {
                    return _docAccount.Id;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error finding doctor: {ex.Message}");
            }

            // Return Guid.Empty if no match or error occurs
            return Guid.Empty;
        }


        public bool AddHealthDataAsync(HealthData healthData, Guid _patientId)
        {
            var _healthData = healthData;
            _healthData.PatientId = _patientId;        // link patientID to healthData
            _healthData.DateTime = DateTime.UtcNow;    // add time stamp

            try
            {
                _dbcontext.HealthData.Add(_healthData);
                _dbcontext.SaveChanges();
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Add health data failed with ${e.Message}");
            }
            return false;
        }

        public List<HealthDataDTO>? GetAllHealthDataAsync(Guid _patientId)
        {
            var healthDataList = new List<HealthData>();

            try
            {
                healthDataList = _dbcontext.HealthData
                   .Where(x => x.PatientId.Equals(_patientId))
                   .ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            return ToHeathDataDTO(healthDataList);
        }
        public List<PatientPrescriptionData>? GetAllPrescriptionData(Guid _patientId) 
        {
            var presciptions = new List<PatientPrescriptionData>();
            try
            {
                presciptions = _dbcontext.PatientPrescriptionData
                    .Where(x => x.PatientId == _patientId)
                    .ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

            return presciptions;
        }
        public List<DoctorNoteDataDTO>? GetAllDoctorNoteData(Guid _patientId)
        {
            var DoctorNotes = new List<DoctorNoteData>();
            try
            {
                DoctorNotes = _dbcontext.PatientDoctorNotes
                    .Where(x => x.PatientID == _patientId)
                    .ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

            return DoctorNoteToDTO(DoctorNotes);
        }

        public List<DoctorNoteDataDTO>? DoctorNoteToDTO(List<DoctorNoteData> doctorNoteDatas)
        {   
            List<DoctorNoteDataDTO> noteDataDTOs = new List<DoctorNoteDataDTO>();

            foreach (var note in doctorNoteDatas)
            {
                noteDataDTOs.Add(new DoctorNoteDataDTO()
                {
                    NoteToPatient = note.NoteToPatient,
                    DoctorProfile = DoctorAccToDTO(FindDoctorAccount(note.DoctorId))
                });

            }
            return noteDataDTOs;
        }
        public DoctorProfile DoctorAccToDTO(DoctorAccount doctorAccount)
        {
            return new DoctorProfile()
            {
                FirstName = doctorAccount.FirstName,
                LastName = doctorAccount.LastName,
                Email = doctorAccount.Email,
                Specialization = doctorAccount.Specialization
            };
        }

        public PatientProfile PatientAccToDTO(PatientAccount patientAccount)
        {
            return new PatientProfile()
            {
                FirstName = patientAccount.FirstName,
                LastName = patientAccount.LastName,
                Email = patientAccount.Email,
                HealthData = GetAllHealthDataAsync(patientAccount.Id),
                PatientPrescriptionData = GetAllPrescriptionData(patientAccount.Id),
                DoctorNoteData = GetAllDoctorNoteData(patientAccount.Id)
            };
        }
        public PatientProfile? GetHealthRecord(Guid patientId)
        {
            var patientAcc = FindPatientAccount(patientId);
            if (patientAcc == null)
            {
                return null;
            }
            return  PatientAccToDTO(patientAcc);

        }
        public List<DoctorProfile> GetAllDoctorProfiles()
        {
            List<DoctorProfile> _docProfiles = new List<DoctorProfile>();
            List<DoctorAccount> _docAccounts = _dbcontext.DoctorAccounts.ToList();

            foreach(var doc in _docAccounts)
            {   
                _docProfiles.Add(DoctorAccToDTO(doc));
            }
            return _docProfiles;
        }

        // Doctor can only access matched patients i.e patients who added doctor A to their list of doctors
        public List<PatientProfile> GetPatientProfiles(Guid _doctorId)
        {
            List<PatientProfile> _patientProfiles = new List<PatientProfile>();
            List<PatientDoctor> _patientDoctor = _dbcontext.PatientDoctors.ToList();

            var _patientIds = _dbcontext.PatientDoctors
                .Where(pd => pd.DoctorID == _doctorId)
                .Select(pd => pd.PatientID)
                .ToList();

            foreach (var patientId in _patientIds) 
            {
                var patientAcc = FindPatientAccount(patientId);
                if (patientAcc != null)
                {
                    _patientProfiles.Add(PatientAccToDTO(patientAcc));
                }
            }
            return _patientProfiles;
        }

        // Patients views their list of doctors
        public List<DoctorProfile> GetMyDoctorsHelper(Guid _patientId)
        {
            List<DoctorProfile> _doctorProfiles = new List<DoctorProfile>();
            List<PatientDoctor> _patientDoctor = _dbcontext.PatientDoctors.ToList();

            var _doctorIds = _dbcontext.PatientDoctors
                .Where(pd => pd.PatientID == _patientId)
                .Select(pd => pd.DoctorID)
                .ToList();

            foreach (var doctorId in _doctorIds)
            {
                var doctorAccount = FindDoctorAccount(doctorId);
                if (doctorAccount != null)
                {
                    _doctorProfiles.Add(DoctorAccToDTO(doctorAccount));
                }
            }
            return _doctorProfiles;
        }

        public PatientAccount? FindPatientAccount(Guid patientId)
        {
            try
            {
                var patientAcc = _dbcontext.PatientAccounts.FirstOrDefault(x => x.Id.Equals(patientId));

                if (patientAcc != null)
                {
                    return patientAcc;
                }
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"Error finding patient: {ex.Message}");
            }
            return null;

        }
        public bool AddPatientToUrgentCareHelper(PatientProfile patientprofile, Guid doctorId)
        {
            var pId = FindPatientIdAsync(patientprofile.Email);
            if (pId == Guid.Empty)
            {
                return false;
            }

            var data = _dbcontext.UrgentCareData.FirstOrDefault(x => x.PatientID == pId);
            if (data != null)
            {
                Console.WriteLine($"Error Patient {patientprofile.FirstName + " " + patientprofile.LastName} already exist");
                return false;
            }
            patientprofile.LastName = _dbcontext.PatientAccounts.First().LastName;

            UrgentCareData _urgentCareData = new UrgentCareData()
            {
                FirstName = patientprofile.FirstName,
                LastName = patientprofile.LastName,
                DoctorID = doctorId,
                PatientID = pId,
            };
            
            
            _dbcontext.UrgentCareData.Add(_urgentCareData);
            _dbcontext.SaveChanges();
            return true;
        }

        public bool RemovePatientFromUrgentCareHelper(PatientProfile patientprofile, Guid doctorId)
        {
            var pId = FindPatientIdAsync(patientprofile.Email);
            if (pId == Guid.Empty)
            {
                return false;
            }

            var data = _dbcontext.UrgentCareData.FirstOrDefault(x => x.PatientID == pId);
            if (data == null)
            {
                Console.WriteLine($"Error Patient {patientprofile.FirstName + " " + patientprofile.LastName} does not exist");
                return false;
            }

            _dbcontext.UrgentCareData.Remove(data);
            _dbcontext.SaveChanges();
            return true;
        }
        public DoctorAccount? FindDoctorAccount(Guid doctorId)
        {
            try
            {
                var doctorAcc = _dbcontext.DoctorAccounts.FirstOrDefault(x => x.Id.Equals(doctorId));

                if (doctorAcc != null)
                {
                    return doctorAcc;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error finding Doctor: {ex.Message}");
            }
            return null;

        }

        public bool AddNewDoctorHelper(DoctorProfile doctorProfile, Guid _patientId)
        {
            var _doctorId = FindDoctorId(doctorProfile);
            if(_doctorId == Guid.Empty)
            {   
                return false;
            }

            var data = _dbcontext.PatientDoctors.FirstOrDefault(x  => x.DoctorID == _doctorId && x.PatientID == _patientId);
            if (data != null)
            {
                Console.WriteLine("Doctor already added");
                return false;
            }

            PatientDoctor patientDoctor = new PatientDoctor();
            patientDoctor.PatientID = _patientId;
            patientDoctor.DoctorID = _doctorId;

            _dbcontext.PatientDoctors.Add(patientDoctor);
            _dbcontext.SaveChanges();
            return true;
        }

        public bool RemoveDoctorFromPatientNetworkHelper(DoctorProfile doctorProfile, Guid _patientId)
        {
            var dId = FindDoctorId(doctorProfile.Email);
            if (dId == Guid.Empty)
            {
                return false;
            }

            var data = _dbcontext.PatientDoctors.FirstOrDefault(x => x.DoctorID == dId && x.PatientID == _patientId);
            if (data == null)
            {
                Console.WriteLine("Doctor is not connected with patient");
                return false;
            }

            _dbcontext.PatientDoctors.Remove(data);
            _dbcontext.SaveChanges();
            return true;
        }

        public List<HealthDataDTO>? ToHeathDataDTO(List<HealthData> healthData)
        {
            if (healthData.IsNullOrEmpty())
            {
                return null;
            }

            List<HealthDataDTO> healthDataDTOs = new List<HealthDataDTO>();
            foreach(var _healthData in healthData)
            {
                healthDataDTOs.Add(new HealthDataDTO
                {
                    BloodPressure = _healthData.BloodPressure,
                    GlucoseLevel = _healthData.GlucoseLevel,
                    BloodSugar = _healthData.BloodSugar,
                    HeartRate = _healthData.HeartRate,
                    DateTime = _healthData.DateTime
                }
                );
            }
            return healthDataDTOs;
        }

        public PatientDisplayProfile? GetPatientDisplayProfileDTO(Guid pateintId)
        {
            var patientAccount = FindPatientAccount(pateintId);
            if (patientAccount == null)
            {
                return null;
            }

            return new PatientDisplayProfile()
            {
                UserName = patientAccount.UserName,
                FirstName = patientAccount.FirstName,
                LastName = patientAccount.LastName,
                Address = patientAccount.Address,
                Email = patientAccount.Email,
                Age = patientAccount.Age,
                City = patientAccount.City,
                Country = patientAccount.Country,
                ZipCode = patientAccount.ZipCode,
                State = patientAccount.State,
                ContactInfo = patientAccount.ContactInfo,
                InsuranceIdentificationNumber = patientAccount.InsuranceIdentificationNumber,
                InsuranceProvider = patientAccount.InsuranceProvider,               
            };
        }

        public DoctorDisplayProfile? GetDoctorDisplayProfileDTO(Guid doctorId)
        {
            var doctorAccount = FindDoctorAccount(doctorId);
            if (doctorAccount == null)
            {
                return null;
            }

            return new DoctorDisplayProfile()
            {
                UserName = doctorAccount.UserName,
                FirstName = doctorAccount.FirstName,
                LastName = doctorAccount.LastName,
                Address = doctorAccount.Address,
                Email = doctorAccount.Email,
                Age = doctorAccount.Age,
                City = doctorAccount.City,
                Country = doctorAccount.Country,
                ZipCode = doctorAccount.ZipCode,
                State = doctorAccount.State,
                ContactInfo = doctorAccount.ContactInfo,
                LicenseNumber = doctorAccount.LicenseNumber,
                Specialization = doctorAccount.Specialization
            };
        }
        public UrgentCareDTO ToUrgentCareDTO(PatientAccount patientAccount) {

            return new UrgentCareDTO()
            {
                FirstName = patientAccount.FirstName,
                LastName = patientAccount.LastName,
            };
        }

        public List<UrgentCareDTO>? GetUrgentCareListHelper(Guid doctorId)
        {
            var doctorAccount = FindDoctorAccount(doctorId);
            if (doctorAccount == null)
            {
                return null;
            }

            List<Guid> patientIds = _dbcontext.UrgentCareData
                .Where(uc => uc.DoctorID == doctorId)
                .Select(uc => uc.PatientID)
                .ToList();

            List<UrgentCareDTO> urgentCareDTOs = new List<UrgentCareDTO>();
            foreach (var patientId in patientIds)
            {
                var patientAcc = FindPatientAccount(patientId);
                if(patientAcc == null) { continue; }
                urgentCareDTOs.Add(
                    ToUrgentCareDTO(patientAcc));
            }
            
            return urgentCareDTOs;
        }

        public bool AddPatientPrescriptionHelper(PatientPrescriptionData patientPrescriptionData, string patientEmail)
        {   
            var pId = FindPatientIdAsync(patientEmail);
            if (pId == Guid.Empty)
            {
                return false;
            }
            patientPrescriptionData.PatientId = pId;
            _dbcontext.PatientPrescriptionData.Add(patientPrescriptionData);
            _dbcontext.SaveChanges();
            return true;
        }

        public bool AddDoctorNoteHelper(DoctorNoteDataDTO doctorNoteDataDTO)
        {
            var pId = FindPatientIdAsync(doctorNoteDataDTO.PatientEmail);
            if (pId == Guid.Empty)
            {
                return false;
            }
            DoctorNoteData doctorNoteData = new DoctorNoteData()
            {
                DoctorId = doctorNoteDataDTO.DoctorID,
                PatientID = pId,
                NoteToPatient = doctorNoteDataDTO.NoteToPatient
            };
            _dbcontext.PatientDoctorNotes.Add(doctorNoteData);
            _dbcontext.SaveChanges();
            return true;
        }

        public DoctorStatsDTO GetDoctorStatsDTO(Guid doctorId)
        {
            var total_report_count = _dbcontext.PatientDoctorNotes
                .Where(pdn => pdn.DoctorId == doctorId)
                .Count();

            var number_of_clients = _dbcontext.PatientDoctors
                .Where(pdn => pdn.DoctorID == doctorId)
                .Count();

            var number_of_UCC = _dbcontext.UrgentCareData
                .Where(ucd => ucd.DoctorID == doctorId)
                .Count();

            return new DoctorStatsDTO()
            {
                TotalReportSent = total_report_count,
                NumberOfClients = number_of_clients,
                NumberOfUrgentCareClients = number_of_UCC,
            };
        }
    }
}
