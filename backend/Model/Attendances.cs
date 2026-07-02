namespace Payrol_Managment_System.Model
{
    public class Attendances
    {
        public int AttendanceID { get; set; }

        public int EmployeeID { get; set; }

        public DateTime AttendanceDate { get; set; }

        public string Statuss { get; set; }
    }
}
