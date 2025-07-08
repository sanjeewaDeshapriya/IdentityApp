using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayController : ControllerBase
    {
        [HttpGet("Get-Players")]
        public IActionResult Players() {
            return Ok(new JsonResult(new { message = "Players data retrieved successfully." }));
        }
       
    }
}
