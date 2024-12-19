using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatientCare_API.Data;
using PatientCare_API.Models.Domains;
using System.Diagnostics.Tracing;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using PatientCare_API.Services;
using Microsoft.IdentityModel.Tokens;
using PatientCare_API.Models.DTO;
namespace PatientCare_API.Controllers
{
    [Authorize(Roles = "Patient")]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientAccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly PatientCarePlusDbContext _dbcontext;
        private readonly ControllerServices _controllerServices;

        public PatientAccountController(UserManager<IdentityUser> userManager, PatientCarePlusDbContext dbContext, ControllerServices controllerServices)
        {
            _userManager = userManager;
            _dbcontext = dbContext;
            _controllerServices = controllerServices;
        }

        // GET ALL: https://localhost:7238/api/PatientAccount
        [HttpGet]
        public IActionResult GetAll()
        {
            var patients = _dbcontext.PatientAccounts.ToList();
            return Ok(patients);
        }

        // GET SINGLE PERSON
        [HttpGet]
        [Route("{id:Guid}")]
        public IActionResult Get([FromRoute] Guid id)
        {
            var patient = _dbcontext.PatientAccounts.FirstOrDefault(x => x.Id == id);
            return Ok(new { id });
        }
        // GET ALL PATIENT'S HEATH_DATA
        [HttpGet]
        [Route("get-all-health-data")]
        public IActionResult GetAllHealthData()
        {
            var _patientId = GetPatientId();
            if (_patientId == Guid.Empty)
            {
                return BadRequest("Failed to find patient");
            }

            var healthDataList = _controllerServices.GetAllHealthDataAsync(_patientId);
            if (healthDataList.IsNullOrEmpty())
            {
                return BadRequest("No existing health data");
            }
            return Ok(healthDataList);
        }
        // GET PATIENT'S HEATH_RECORD
        [HttpGet]
        [Route("get-health-record")]
        public IActionResult GetHealthRecord()
        {
            var _patientId = GetPatientId();
            if (_patientId == Guid.Empty)
            {
                return BadRequest("Failed to find patient");
            }

            var healthRecord = _controllerServices.GetHealthRecord(_patientId);
            if (healthRecord == null)
            {
                return BadRequest("No existing health record");
            }
            return Ok(healthRecord);
        }
        // GET Patient Display Profile
        [HttpGet]
        [Route("get-patient-display-profile")]
        public IActionResult GetPatientDisplayProfile()
        {
            var _patientId = GetPatientId();
            if (_patientId == Guid.Empty)
            {
                return BadRequest("Failed to find patient");
            }

            var patientDisplayProfile = _controllerServices.GetPatientDisplayProfileDTO(_patientId);
            if (patientDisplayProfile == null)
            {
                return BadRequest("Bad request");
            }
            return Ok(patientDisplayProfile);
        }

        // GET ALL Doctor Profile
        [HttpGet]
        [Route("get-all-doctors")]
        public IActionResult GetAllDoctorProfiles()
        {
            var DoctorProfiles = _controllerServices.GetAllDoctorProfiles();

            if (DoctorProfiles.IsNullOrEmpty())
            {
                return BadRequest("NoContent");
            }
            return Ok(DoctorProfiles);
        }

        // GET MY Doctors
        [HttpGet]
        [Route("get-my-doctors")]
        public IActionResult GetMyDoctorProfiles()
        {
            var _patientId = GetPatientId();
            if (_patientId == Guid.Empty)
            {
                return BadRequest("Failed to find patient");
            }
            var DoctorProfiles = _controllerServices.GetMyDoctorsHelper(_patientId);

            if (DoctorProfiles.IsNullOrEmpty())
            {
                return BadRequest("NoContent");
            }
            return Ok(DoctorProfiles);
        }

        // GET LOGIN HELPER
        [HttpGet]
        [Route("get-patient-login-info")]
        public IActionResult GetPatientLoginInfo()
        {
            var username = FindUserIdentyAsync();
            var result = _controllerServices.GetPatientLoginInfo(username);

            if (result == null)
            {
                return BadRequest("Failed to find patient info");
            }

            return Ok(result);
        }

        // POST Add New Patient
        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromBody] PatientAccount patient)
        {
            if (patient == null)
            {
                return BadRequest("Bad Request: failed to add patient");
            }

            _dbcontext.PatientAccounts.Add(patient);
            _dbcontext.SaveChanges();

            return Ok("Registered patient");
        }

        // POST Logout
        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {

            return Ok("Successfully logged out");
        }

        // POST CREATE HEALTH_DATA
        [HttpPost]
        [Route("create/healthData")]
        public IActionResult CreateHealthData([FromBody] HealthData healthData)
        {
            var _patientId = GetPatientId();
            if (_patientId == Guid.Empty)
            {
                return BadRequest("Failed to find patient");
            }

            var result = _controllerServices.AddHealthDataAsync(healthData, _patientId);
            if (!result)
            {
                return BadRequest("Failed to create health data");
            }

            return Ok("New health data saved!");
        }

        // POST ADD DOCTOR TO ACC
        [HttpPost]
        [Route("add/new-doctor")]
        public IActionResult AddNewDoctor([FromBody] DoctorProfile doctorProfile)
        {
            var _patientId = GetPatientId();
            if(_patientId == Guid.Empty)
            {
                return BadRequest("Failed to find patient");
            }
            var result = _controllerServices.AddNewDoctorHelper(doctorProfile, _patientId);

            if (!result)
            {
                return BadRequest("Failed to add doctor");
            }

            return Ok("Success");
        }

        // Delete: Delete Doctor from Patient Network
        [HttpDelete]
        [Route("remove-from-patient-network")]
        public IActionResult RemoveDoctorFromNetwork([FromBody] DoctorProfile doctorProfile)
        {
            var _patientId = GetPatientId();
            if (_patientId == Guid.Empty)
            {
                return BadRequest("Failed to find patient");
            }
            var result = _controllerServices.RemoveDoctorFromPatientNetworkHelper(doctorProfile, _patientId);

            if (!result)
            {
                return BadRequest("Failed to remove doctor");
            }

            return Ok("Success");
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
        public Guid GetPatientId()
        {
            var username = FindUserIdentyAsync();
            var _patientId = _controllerServices.FindPatientIdAsync(username);
            if (_patientId == Guid.Empty)
            {
                Console.WriteLine($"PatientId {username} not found");
                return Guid.Empty;
            }
            return _patientId;
        }

        #endregion
    }
}
