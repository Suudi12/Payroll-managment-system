using Microsoft.Data.SqlClient;
using Payrol_Managment_System.Model;
using System.Data;


namespace Payrol_Managment_System.Data
{
    public class EmployeeData
    {
        string connString = "Data Source=;Initial Catalog=Payroll_Managment_System_DB;" +
          "Integrated Security=True;TrustServerCertificate=True";
        //get by id
        public Employeess GetEmployeeById(int id)
        {
            Employeess emp = null;

            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                string query = "SELECT * FROM Employeess WHERE EmployeeID=@EmployeeID";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@EmployeeID", id);

                cnn.Open();

                SqlDataReader dr = cmd.ExecuteReader();

                if (dr.Read())
                {
                    emp = new Employeess
                    {
                        EmployeeID = int.Parse(dr["EmployeeID"].ToString()),
                        FullName = dr["FullName"].ToString(),
                        Position = dr["Position"].ToString(),
                        HireDate = DateTime.Parse(dr["HireDate"].ToString())
                    };
                }

                cnn.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return emp;
        }
        //get all emplyee
        public List<Employeess> GetEmployees()
        {
            List<Employeess> employees = new List<Employeess>();

            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                string query = "SELECT * FROM Employeess";

                SqlDataAdapter da = new SqlDataAdapter(query, cnn);

                DataTable dt = new DataTable();

                da.Fill(dt);

                foreach (DataRow dr in dt.Rows)
                {
                    employees.Add(new Employeess
                    {
                        EmployeeID = int.Parse(dr["EmployeeID"].ToString()),
                        FullName = dr["FullName"].ToString(),
                        Position = dr["Position"].ToString(),
                        HireDate = DateTime.Parse(dr["HireDate"].ToString())
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return employees;
        }
        //insertr
        public string AddEmployee(Employeess emp)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);
                cnn.Open();

                string checkQuery = "SELECT COUNT(*) FROM Employeess WHERE FullName=@FullName";

                SqlCommand checkCmd = new SqlCommand(checkQuery, cnn);
                checkCmd.Parameters.AddWithValue("@FullName", emp.FullName);

                int count = (int)checkCmd.ExecuteScalar();

                if (count > 0)
                {
                    cnn.Close();
                    return "FullName hore ayuu u jiraa";
                }

                string query = "INSERT INTO Employeess(FullName,Position) VALUES(@FullName,@Position)";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@FullName", emp.FullName);
                cmd.Parameters.AddWithValue("@Position", emp.Position);

                cmd.ExecuteNonQuery();
                cnn.Close();

                return "Employee Added Successfully";
            }
            catch
            {
                return "Qalad ayaa dhacay";
            }
        }
        //UPDATE 
        public string UpdateEmployee(Employeess emp)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);
                cnn.Open();

                // Check duplicate FullName
                string checkQuery = @"SELECT COUNT(*)
                              FROM Employeess
                              WHERE FullName=@FullName
                              AND EmployeeID<>@EmployeeID";

                SqlCommand checkCmd = new SqlCommand(checkQuery, cnn);

                checkCmd.Parameters.AddWithValue("@FullName", emp.FullName);
                checkCmd.Parameters.AddWithValue("@EmployeeID", emp.EmployeeID);

                int duplicate = (int)checkCmd.ExecuteScalar();

                if (duplicate > 0)
                {
                    cnn.Close();
                    return "FullName hore ayuu u jiraa";
                }

                string query = @"UPDATE Employeess
                         SET FullName=@FullName,
                             Position=@Position
                         WHERE EmployeeID=@EmployeeID";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@EmployeeID", emp.EmployeeID);
                cmd.Parameters.AddWithValue("@FullName", emp.FullName);
                cmd.Parameters.AddWithValue("@Position", emp.Position);

                int count = cmd.ExecuteNonQuery();

                cnn.Close();

                if (count == 0)
                {
                    return "EmployeeID ma jiro";
                }

                return "Employee Updated Successfully";
            }
            catch
            {
                return "Qalad ayaa dhacay";
            }
        }
        //DELETE
        public string DeleteEmployee(int id)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);
                cnn.Open();

                string query = "DELETE FROM Employeess WHERE EmployeeID=@EmployeeID";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@EmployeeID", id);

                int count = cmd.ExecuteNonQuery();

                cnn.Close();

                if (count == 0)
                {
                    return "EmployeeID ma jiro";
                }

                return "Employee Deleted Successfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
