using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PatientCare_API.Data;
using PatientCare_API.Models.Domains;
using PatientCare_API.Models.DTO;
using PatientCare_API.Services;

namespace PatientCare_API.Controllers
{
    [Authorize(Roles = "Doctor")]
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorAccountController : ControllerBase
    {
        private readonly PatientCarePlusDbContext _dbcontext;
        private readonly ControllerServices _controllerServices;

        public DoctorAccountController(PatientCarePlusDbContext dbContext, ControllerServices controllerServices)
        {
            _dbcontext = dbContext;
            _controllerServices = controllerServices;
        }

        // GET ALL: https://localhost:7238/api/DoctorAccount
        [HttpGet]
        public IActionResult GetAll()
        {
            var doctor = _dbcontext.DoctorAccounts.ToList();
            return Ok(doctor);
        }

        // GET: SINGLE Doctor
        [HttpGet]
        [Route("{id:Guid}")]
        public IActionResult Get([FromRoute] Guid id)
        {
            var doctor = _dbcontext.DoctorAccounts.FirstOrDefault(x => x.Id == id);
            return Ok(new { id });
        }

        // GET Doctor Display Profile
        [HttpGet]
        [Route("get-doctor-display-profile")]
        public IActionResult GetDoctorDisplayProfile()
        {
            var _doctorId = GetDoctorId();
            if (_doctorId == Guid.Empty)
            {
                return BadRequest("Failed to find doctor");
            }

            var doctorDisplayProfile = _controllerServices.GetDoctorDisplayProfileDTO(_doctorId);
            if (doctorDisplayProfile == null)
            {
                return BadRequest("Bad request");
            }
            return Ok(doctorDisplayProfile);
        }

        // GET Doctor Urgent Care List Profile
        [HttpGet]
        [Route("get-urgent-care-list")]
        public IActionResult GetUrgentCareList()
        {
            var _doctorId = GetDoctorId();
            if (_doctorId == Guid.Empty)
            {
                return BadRequest("Failed to find doctor");
            }

            var urgentCareList = _controllerServices.GetUrgentCareListHelper(_doctorId);
            if (urgentCareList == null)
            {
                return BadRequest("No data");
            }
            return Ok(urgentCareList);
        }

        //GET: View My Patients
        [HttpGet]
        [Route("get/all-patients/profiles")]
        public IActionResult GetPatientsProfiles()
        {

            var _doctorId = GetDoctorId();
            if (_doctorId == Guid.Empty)
            {
                return BadRequest("Failed to find doctor");
            }

            var patientsProfiles = _controllerServices.GetPatientProfiles(_doctorId);
            if (patientsProfiles.IsNullOrEmpty())
            {
                return BadRequest("No existing health data");
            }

            return Ok(patientsProfiles);
        }

        [HttpGet]
        [Route("get/doctor-dashboard/stats")]
        public IActionResult GetDoctorHomeStats()
        {

            var _doctorId = GetDoctorId();
            if (_doctorId == Guid.Empty)
            {
                return BadRequest("Failed to find doctor");
            }

            var doctor_stats = _controllerServices.GetDoctorStatsDTO(_doctorId);
            if (doctor_stats == null)
            {
                return BadRequest("Doctor has no data");
            }

            return Ok(doctor_stats);
        }

        // GET Doctor Home Stats
        [HttpGet]
        [Route("get-doctor-dashboard-stats")]
        public IActionResult GetDoctorDashboardStats()
        {
            var _doctorId = GetDoctorId();
            if (_doctorId == Guid.Empty)
            {
                return BadRequest("Failed to find doctor");
            }

            var doctorDisplayProfile = _controllerServices.GetDoctorDisplayProfileDTO(_doctorId);
            if (doctorDisplayProfile == null)
            {
                return BadRequest("Bad request");
            }
            return Ok(doctorDisplayProfile);
        }

        // GET LOGIN HELPER
        [HttpGet]
        [Route("get-doctor-login-info")]
        public IActionResult GetDoctorLoginInfo()
        {
            var username = FindUserIdentyAsync();
            var result = _controllerServices.GetDoctorLoginInfo(username);

            if (result == null)
            {
                return BadRequest("Failed to find doctor info");
            }

            return Ok(result);
        }

        // POST Logout
        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {

            return Ok("Successfully logged out");
        }

        // POST: Add Doctor Office
        [HttpPost]
        [Route("add-Office")]
        public IActionResult AddOffice([FromBody] DoctorOffice doctorOffice)
        {
            if (doctorOffice == null)
            {
                return BadRequest("Bad Request: failed to add doctor");
            }

            _dbcontext.DoctorOffices.Add(doctorOffice);
            _dbcontext.SaveChanges();

            return Ok(doctorOffice.ClinicName + "to offices");
        }
        // POST: Add New Doctor
        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromBody] DoctorAccount doctor)
        {
            if (doctor == null)
            {
                return BadRequest("Bad Request: failed to add doctor");
            }

            _dbcontext.DoctorAccounts.Add(doctor);
            _dbcontext.SaveChanges();

            return Ok("Registered doctor Dr. " + doctor.FirstName);
        }

        // POST: Add Patient to Urgernt Care List
        [HttpPost]
        [Route("add-to-urgent-care")]
        public IActionResult AddPatientToUrgentCare([FromBody] PatientProfile patientProfile)
        {
            if (patientProfile == null)
            {
                return BadRequest("Bad Request: failed to add patient");
            }

            var doctorId = GetDoctorId();
            var result = _controllerServices.AddPatientToUrgentCareHelper(patientProfile, doctorId);
            if (!result)
            {
                return BadRequest("Bad Request: failed to add patient");
            }

            return Ok("Success");
        }

        // POST: Add Patient Precription
        [HttpPost]
        [Route("add-to-patient-precription")]
        public IActionResult AddPatientPrescription([FromBody] PatientPrescriptionRequest request)
        {
            var patientPrescriptionData = request.PatientPrescriptionData;
            var patientEmail = request.PatientEmail;
            if (patientPrescriptionData == null || patientEmail == string.Empty)
            {
                return BadRequest("Bad Request: failed to add patient");
            }

            var doctorId = GetDoctorId();
            var result = _controllerServices.AddPatientPrescriptionHelper(patientPrescriptionData, patientEmail);
            if (!result)
            {
                return BadRequest("Bad Request: failed to add patient");
            }

            return Ok("Success");
        }

        // POST: Add Doctor Note to Patient
        [HttpPost]
        [Route("add-doctor-note")]
        public IActionResult AddDoctorNote(DoctorNoteDataDTO doctorNoteData)
        {
            if (doctorNoteData == null)
            {
                return BadRequest("Bad Request: failed to send note patient");
            }

            var doctorId = GetDoctorId();
            doctorNoteData.DoctorID = doctorId;

            var result = _controllerServices.AddDoctorNoteHelper(doctorNoteData);
            if (!result)
            {
                return BadRequest("Bad Request: failed to add patient");
            }

            return Ok("Success");
        }
        // Delete: Delete Patient from Urgernt Care List
        [HttpDelete]
        [Route("remove-from-urgent-care")]
        public IActionResult RemovePatientFromUrgentCare([FromBody] PatientProfile patientProfile)
        {
            if (patientProfile == null)
            {
                return BadRequest("Bad Request: failed to remove patient");
            }

            var doctorId = GetDoctorId();
            var result = _controllerServices.RemovePatientFromUrgentCareHelper(patientProfile, doctorId);
            if (!result)
            {
                return BadRequest("Bad Request: failed to remove patient");
            }

            return Ok("Patient removed");
        }

        #region helpers
        [ApiExplorerSettings(IgnoreApi = true)]
        public string FindUserIdentyAsync()
        {
            var username = string.Empty;
            // Retrieve username from User Claim in the JWT
            try
            {
                var usernameClaim = User.Claims.ElementAt(0).Value;
                username = usernameClaim;  // Extract the username
            }
            catch (Exception e)
            {
                Console.WriteLine($"Find user identity failed with ${e.Message}");
                throw;
            }
            return username;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public Guid GetDoctorId() 
        {
            var username = FindUserIdentyAsync();
            var _doctorId = _controllerServices.FindDoctorId(username);
            if (_doctorId == Guid.Empty)
            {
                Console.WriteLine($"Error! No doctor with email {username}");
                return Guid.Empty;
            }
            return _doctorId;
        }

        #endregion
    }
}
