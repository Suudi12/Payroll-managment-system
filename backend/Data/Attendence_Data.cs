using Microsoft.Data.SqlClient;
using Payrol_Managment_System.Model;
using System.Data;

namespace Payrol_Managment_System.Data
{
    public class Attendence_Data
    {

        string connString = "Data Source=;Initial Catalog=Payroll_Managment_System_DB;" +
          "Integrated Security=True;TrustServerCertificate=True";
        public List<Attendances> GetAttendances()
        {
            List<Attendances> attendance = new List<Attendances>();

            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                string query = "SELECT * FROM Attendances";

                SqlDataAdapter da = new SqlDataAdapter(query, cnn);

                DataTable dt = new DataTable();

                da.Fill(dt);

                foreach (DataRow dr in dt.Rows)
                {
                    attendance.Add(new Attendances
                    {
                        AttendanceID = int.Parse(dr["AttendanceID"].ToString()),
                        EmployeeID = int.Parse(dr["EmployeeID"].ToString()),
                        AttendanceDate = DateTime.Parse(dr["AttendanceDate"].ToString()),
                        Statuss = dr["Statuss"].ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return attendance;
        }
        //inter
        public string AddAttendance(Attendances att)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);
                cnn.Open();

                // Check EmployeeID
                string checkEmployee = "SELECT COUNT(*) FROM Employeess WHERE EmployeeID=@EmployeeID";

                SqlCommand checkCmd = new SqlCommand(checkEmployee, cnn);
                checkCmd.Parameters.AddWithValue("@EmployeeID", att.EmployeeID);

                int employeeCount = (int)checkCmd.ExecuteScalar();

                if (employeeCount == 0)
                {
                    cnn.Close();
                    return "EmployeeID ma jiro";
                }

                // Check duplicate attendance today
                string duplicateQuery = @"SELECT COUNT(*)
                                  FROM Attendances
                                  WHERE EmployeeID=@EmployeeID
                                  AND AttendanceDate=CAST(GETDATE() AS DATE)";

                SqlCommand duplicateCmd = new SqlCommand(duplicateQuery, cnn);
                duplicateCmd.Parameters.AddWithValue("@EmployeeID", att.EmployeeID);

                int duplicate = (int)duplicateCmd.ExecuteScalar();

                if (duplicate > 0)
                {
                    cnn.Close();
                    return "Attendance maanta hore ayaa loo diiwaangeliyey";
                }

                string query = @"INSERT INTO Attendances
                        (EmployeeID, Statuss)
                        VALUES
                        (@EmployeeID, @Statuss)";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@EmployeeID", att.EmployeeID);
                cmd.Parameters.AddWithValue("@Statuss", att.Statuss);

                cmd.ExecuteNonQuery();

                cnn.Close();

                return "Attendance Added Successfully";
            }
            catch
            {
                return "Qalad ayaa dhacay";
            }
        }
        //update
        public string UpdateAttendance(Attendances att)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);
                cnn.Open();

                // Check EmployeeID exists
                string checkEmployee = "SELECT COUNT(*) FROM Employeess WHERE EmployeeID=@EmployeeID";

                SqlCommand checkCmd = new SqlCommand(checkEmployee, cnn);
                checkCmd.Parameters.AddWithValue("@EmployeeID", att.EmployeeID);

                int employeeCount = (int)checkCmd.ExecuteScalar();

                if (employeeCount == 0)
                {
                    cnn.Close();
                    return "EmployeeID ma jiro";
                }

                string query = @"UPDATE Attendances
                         SET EmployeeID=@EmployeeID,
                             Statuss=@Statuss
                         WHERE AttendanceID=@AttendanceID";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@AttendanceID", att.AttendanceID);
                cmd.Parameters.AddWithValue("@EmployeeID", att.EmployeeID);
                cmd.Parameters.AddWithValue("@Statuss", att.Statuss);

                int count = cmd.ExecuteNonQuery();

                cnn.Close();

                if (count == 0)
                {
                    return "AttendanceID ma jiro";
                }

                return "Attendance Updated Successfully";
            }
            catch
            {
                return "Qalad ayaa dhacay";
            }
        }
        //delete
        public string DeleteAttendance(int id)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                string query = "DELETE FROM Attendances WHERE AttendanceID=@AttendanceID";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@AttendanceID", id);

                cnn.Open();

                int count = cmd.ExecuteNonQuery();

                cnn.Close();

                if (count == 0)
                {
                    return "AttendanceID ma jiro";
                }

                return "Attendance Deleted Successfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
