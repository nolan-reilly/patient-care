using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PatientCare_API.Models.OAth;
using System.Data;

namespace PatientCare_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            var user = new IdentityUser { UserName = model.Email, Email = model.Email};
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return BadRequest(result.Errors);
            }

            // Assign User Role
            var assignRoleResult = await AssignRoleAsync(user, model.Role);

            if(!assignRoleResult.Succeeded)
            {
                return BadRequest("Failed to assign role");
            }

            return Ok(new { message = $"{model.Role} registered successfully" });
            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
                    SecurityAlgorithms.HmacSha256));

                var role = _userManager.GetRolesAsync(user).Result.ElementAt(0);

                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) ,
                                userRole = role});
            }

            return Unauthorized();
        }

        #region helper
        private async Task<IdentityResult> AssignRoleAsync(IdentityUser user, string role)
        {
            try
            {
                // Check if the role exists
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    return IdentityResult.Failed(new IdentityError { Description = $"Role '{role}' does not exist." });
                }

                // Assign role to the user
                var result = await _userManager.AddToRoleAsync(user, role);
                return result;
            }
            catch (Exception ex)
            {
                // Return a failed IdentityResult with the error
                return IdentityResult.Failed(new IdentityError { Description = $"Error assigning role: {ex.Message}" });
            }
        }
    }

    #endregion

}
