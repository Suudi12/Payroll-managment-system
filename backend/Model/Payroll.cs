namespace Payrol_Managment_System.Model
{
    public class Payroll
    {
        public int PayrollID { get; set; }

        public int EmployeeID { get; set; }

        public decimal BasicSalary { get; set; }

        public decimal Allowance { get; set; }

        public decimal Deduction { get; set; }

        public decimal NetSalary
        {
            get { return BasicSalary + Allowance - Deduction; }
        }
    }
}
