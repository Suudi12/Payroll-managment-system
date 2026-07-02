using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payrol_Managment_System.Data;
using Payrol_Managment_System.Model;

namespace Payrol_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        EmployeeData data = new EmployeeData();
        [HttpGet("{id}")]
        public IActionResult GetEmployeeById(int id)
        {
            var employee = data.GetEmployeeById(id);

            if (employee == null)
            {
                return NotFound("EmployeeID ma jiro");
            }

            return Ok(employee);
        }

        [HttpGet]
        public IActionResult GetEmployees()
        {
            return Ok(data.GetEmployees());
        }

        [HttpPost]
        public IActionResult AddEmployee(Employeess emp)
        {
            return Ok(data.AddEmployee(emp));
        }

        [HttpPut]
        public IActionResult UpdateEmployee(Employeess emp)
        {
            return Ok(data.UpdateEmployee(emp));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            return Ok(data.DeleteEmployee(id));
        }
    }
}
