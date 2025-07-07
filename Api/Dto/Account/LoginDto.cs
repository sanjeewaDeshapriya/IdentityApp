using System.ComponentModel.DataAnnotations;

namespace Api.Dto.Account
{
    public class LoginDto
    {
        [Required (ErrorMessage ="Check User name ")]
        public string userName { get; set; }
        [Required(ErrorMessage = "Check User Password ")]
        public string password { get; set; }
    }
}
