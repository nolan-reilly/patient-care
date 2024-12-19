using System.ComponentModel.DataAnnotations;

namespace PatientCare_API.Models.Domains
{
    public class Account
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(10, ErrorMessage = "The UserName must be at most 10 characters long.")]
        [Display(Name = "UserName")]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [StringLength(20, ErrorMessage = "The First Name cannot be longer than 20 characters.")]
        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "The Last Name cannot be longer than 20 characters.")]
        [Display(Name = "Last Name")]
        public string LastName { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Range(0, 120, ErrorMessage = "Age must be between 0 and 120.")]
        public int Age { get; set; }

        public string? City { get; set; }
        public string? State { get; set; }
        public int ZipCode { get; set; }

        [StringLength(12, ErrorMessage = "The ContactInfo cannot be longer than 12 characters.")]
        public string? ContactInfo { get; set; }

        [StringLength(100, ErrorMessage = "The Address cannot be longer than 100 characters.")]
        public string? Address { get; set; }

        public string? Country { get; set; }
    }
}
