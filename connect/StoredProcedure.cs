using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BookTruckWeb.connect
{
    public class StoredProcedure
    {
        private readonly IConfiguration _configuration;
        public StoredProcedure(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CallGenerateNumberJob(string jobNo)
        {
            // ดึงค่า Connection String จาก appsettings.json
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            string jobNumber = null;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("generate_numberJob", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@job", jobNo);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                jobNumber = reader["JobNumber"]?.ToString();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            return jobNumber;
        }
    }
}
