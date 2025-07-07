using Api.Dto.Account;
using Api.Models;
using Api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _JWTService;
        private readonly SignInManager<User> _SignInManager;
        private readonly UserManager<User> _UserManager;

        public AccountController(JWTService jwtService, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            
            _JWTService = jwtService;
            _SignInManager = signInManager;
            _UserManager = userManager;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _UserManager.FindByNameAsync(model.userName);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }
            if(user.EmailConfirmed == false) 
            {
                return Unauthorized("Email not confirmed");
            }

            var result = await _SignInManager.CheckPasswordSignInAsync(user, model.password, false);

            if (!result.Succeeded)
            {
                return Unauthorized("Invalid username or password");
            }
            return Ok(CreateApplicationUserDto(user));
        }


        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto model)
        {
            if (await checkemailExsistsAsync(model.Email)) {
                return BadRequest($"An Exsisting account is using {model.Email}.plase try with another email address");
            }
            var user = new User
            {
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                EmailConfirmed = true
            }; 

            var result = await _UserManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }



            return Ok(new JsonResult (new { title = "Account Created",message = "Your Account has beign crated succsessfully" }));
        }

        [Authorize]
        [HttpGet("refresh-user-toke")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _UserManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }
        

        #region Private Helper Methods
        private UserDto CreateApplicationUserDto(User user) {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                jwt = _JWTService.CrateJWT(user)

            };
        }

        private async Task<bool> checkemailExsistsAsync(string email)
        {
            return await _UserManager.Users.AnyAsync(u => u.Email == email.ToLower());
        }
        #endregion

    }
}
