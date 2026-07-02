using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payrol_Managment_System.Data;
using Payrol_Managment_System.Model;

namespace Payrol_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayrollController : ControllerBase
    {
            Payroll_Data data = new Payroll_Data();

            [HttpGet]
            public IActionResult GetPayrolls()
            {
                return Ok(data.GetPayrolls());
            }

            [HttpPost]
            public IActionResult AddPayroll(Payroll pay)
            {
                return Ok(data.AddPayroll(pay));
            }

            [HttpPut]
            public IActionResult UpdatePayroll(Payroll pay)
            {
                return Ok(data.UpdatePayroll(pay));
            }

            [HttpDelete("{id}")]
            public IActionResult DeletePayroll(int id)
            {
                return Ok(data.DeletePayroll(id));
            }
        }
    }

