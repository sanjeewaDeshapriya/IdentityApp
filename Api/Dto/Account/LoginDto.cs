﻿using System.ComponentModel.DataAnnotations;

namespace Api.Dto.Account
{
    public class LoginDto
    {
        [Required]
        public string userName { get; set; }
        [Required]
        public string password { get; set; }
    }
}
