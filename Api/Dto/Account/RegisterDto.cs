using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Api.Dto.Account
{
    public class RegisterDto
    {
        

        [Required]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "First name " +
            " must be between 3 and 4 characters.")]
        public string FirstName { get; set; }

  

        [Required]
        [StringLength(15, MinimumLength = 3, ErrorMessage = " last name must be between 3 and 4 characters.")]
        public string LastName { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Password must than 6 characters.")]
        public string Password { get; set; }
    }
}
