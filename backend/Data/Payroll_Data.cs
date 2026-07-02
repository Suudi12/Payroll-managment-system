using Microsoft.Data.SqlClient;
using Payrol_Managment_System.Model;
using System.Data;

namespace Payrol_Managment_System.Data
{
    public class Payroll_Data
    {
        string connString = "Data Source=;Initial Catalog=Payroll_Managment_System_DB;" +
        "Integrated Security=True;TrustServerCertificate=True";
        //getall
        public List<Payroll> GetPayrolls()
        {
            List<Payroll> payrolls = new List<Payroll>();

            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                string query = "SELECT * FROM Payroll";

                SqlDataAdapter da = new SqlDataAdapter(query, cnn);

                DataTable dt = new DataTable();

                da.Fill(dt);

                foreach (DataRow dr in dt.Rows)
                {
                    payrolls.Add(new Payroll
                    {
                        PayrollID = int.Parse(dr["PayrollID"].ToString()),
                        EmployeeID = int.Parse(dr["EmployeeID"].ToString()),
                        BasicSalary = decimal.Parse(dr["BasicSalary"].ToString()),
                        Allowance = decimal.Parse(dr["Allowance"].ToString()),
                        Deduction = decimal.Parse(dr["Deduction"].ToString())
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return payrolls;
        }
        //insert
        public string AddPayroll(Payroll pay)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                cnn.Open();

                string checkQuery = "SELECT COUNT(*) FROM Employeess WHERE EmployeeID=@EmployeeID";

                SqlCommand checkCmd = new SqlCommand(checkQuery, cnn);
                checkCmd.Parameters.AddWithValue("@EmployeeID", pay.EmployeeID);

                int count = (int)checkCmd.ExecuteScalar();

                if (count == 0)
                {
                    cnn.Close();
                    return "EmployeeID ma jiro.";
                }

                string query = @"INSERT INTO Payroll
                        (EmployeeID,BasicSalary,Allowance,Deduction)
                        VALUES
                        (@EmployeeID,@BasicSalary,@Allowance,@Deduction)";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@EmployeeID", pay.EmployeeID);
                cmd.Parameters.AddWithValue("@BasicSalary", pay.BasicSalary);
                cmd.Parameters.AddWithValue("@Allowance", pay.Allowance);
                cmd.Parameters.AddWithValue("@Deduction", pay.Deduction);

                cmd.ExecuteNonQuery();
                cnn.Close();

                return "Payroll Added Successfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        //update
        public string UpdatePayroll(Payroll pay)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                cnn.Open();

                string checkQuery = "SELECT COUNT(*) FROM Payroll WHERE PayrollID=@PayrollID";

                SqlCommand checkCmd = new SqlCommand(checkQuery, cnn);
                checkCmd.Parameters.AddWithValue("@PayrollID", pay.PayrollID);

                int count = (int)checkCmd.ExecuteScalar();

                if (count == 0)
                {
                    cnn.Close();
                    return "PayrollID ma jiro.";
                }

                string query = @"UPDATE Payroll
                         SET EmployeeID=@EmployeeID,
                             BasicSalary=@BasicSalary,
                             Allowance=@Allowance,
                             Deduction=@Deduction
                         WHERE PayrollID=@PayrollID";

                SqlCommand cmd = new SqlCommand(query, cnn);

                //cmd.Parameters.AddWithValue("@PayrollID", pay.PayrollID);
                cmd.Parameters.AddWithValue("@EmployeeID", pay.EmployeeID);
                cmd.Parameters.AddWithValue("@BasicSalary", pay.BasicSalary);
                cmd.Parameters.AddWithValue("@Allowance", pay.Allowance);
                cmd.Parameters.AddWithValue("@Deduction", pay.Deduction);

                cmd.ExecuteNonQuery();
                cnn.Close();

                return "Payroll Updated Successfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        //delete
        public string DeletePayroll(int id)
        {
            try
            {
                SqlConnection cnn = new SqlConnection(connString);

                cnn.Open();

                string checkQuery = "SELECT COUNT(*) FROM Payroll WHERE PayrollID=@PayrollID";

                SqlCommand checkCmd = new SqlCommand(checkQuery, cnn);
                checkCmd.Parameters.AddWithValue("@PayrollID", id);

                int count = (int)checkCmd.ExecuteScalar();

                if (count == 0)
                {
                    cnn.Close();
                    return "PayrollID ma jiro.";
                }

                string query = "DELETE FROM Payroll WHERE PayrollID=@PayrollID";

                SqlCommand cmd = new SqlCommand(query, cnn);

                cmd.Parameters.AddWithValue("@PayrollID", id);

                cmd.ExecuteNonQuery();
                cnn.Close();

                return "Payroll Deleted Successfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

    }
}
