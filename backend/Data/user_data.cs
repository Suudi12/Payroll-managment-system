using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Payrol_Managment_System.Model;
using System.Data;

namespace Payrol_Managment_System.Data
{

    public class user_data
    {
        string connString = "Data Source=.;Initial Catalog=Payroll_Managment_System_DB;Integrated Security=True;TrustServerCertificate=True";

        public List<User> GetUsers()
        {
            List<User> user = new List<User>();

            SqlConnection cnn = new SqlConnection(connString);

            string query = "SELECT*FROM users";

            SqlDataAdapter da = new SqlDataAdapter(query, cnn);

            DataTable dt = new DataTable();

            da.Fill(dt);

            foreach (DataRow dr in dt.Rows)
            {
                user.Add(new User
                {
                    Username = dr["username"].ToString(),
                    Password = dr["passpowr"].ToString(),
                    Status = dr["statuse"].ToString()

                });
            }
            return user;
        }
    }
}
