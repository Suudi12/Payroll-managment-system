using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payrol_Managment_System.Data;
using Payrol_Managment_System.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Payrol_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        user_data data = new user_data();

        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(data.GetUsers());
        }
    }
}
