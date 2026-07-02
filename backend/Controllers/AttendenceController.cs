using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payrol_Managment_System.Data;
using Payrol_Managment_System.Model;

namespace Payrol_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendenceController : ControllerBase
    {
     
            Attendence_Data data = new Attendence_Data();

            [HttpGet]
            public IActionResult GetAttendance()
            {
                return Ok(data.GetAttendances());
            }

            [HttpPost]
            public IActionResult AddAttendance(Attendances att)
            {
                return Ok(data.AddAttendance(att));
            }

            [HttpPut]
            public IActionResult UpdateAttendance( Attendances att)
            {
                return Ok(data.UpdateAttendance( att));
            }

            [HttpDelete("{id}")]
            public IActionResult DeleteAttendance(int id)
            {
                return Ok(data.DeleteAttendance(id));
            }
        }
    }

