using System;
using System.Security.Cryptography;
using System.Text;
namespace BookTruckWeb.fuc
{
    public class Function
    {
        private static string key = "1189381006241";
        public static TripleDESCryptoServiceProvider DES = new TripleDESCryptoServiceProvider();

        public static MD5CryptoServiceProvider MD5 = new MD5CryptoServiceProvider();
        public static byte[] MD5Hash(string value)
        {
            return MD5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(value));
        }
        public static string Encrypt(string stringToEncrypt)
        {
            string functionReturnValue = null;

            functionReturnValue = "";
            try
            {
                DES.Key = MD5Hash(key);
                DES.Mode = CipherMode.ECB;
                byte[] Buffer = ASCIIEncoding.ASCII.GetBytes(stringToEncrypt);
                functionReturnValue = Convert.ToBase64String(DES.CreateEncryptor().TransformFinalBlock(Buffer, 0, Buffer.Length));
            }
            catch (Exception ex)
            {
                functionReturnValue = "AAAAA";
                Console.WriteLine("Wrong Key Number, decryption not available!");
            }
            return functionReturnValue;
        }

        public static string Decrypt(string encryptedString)
        {
            string functionReturnValue = null;

            functionReturnValue = "";
            try
            {
                DES.Key = MD5Hash(key);
                DES.Mode = CipherMode.ECB;
                byte[] Buffer = Convert.FromBase64String(encryptedString.Replace(' ', '+'));
                return ASCIIEncoding.ASCII.GetString(DES.CreateDecryptor().TransformFinalBlock(Buffer, 0, Buffer.Length));
            }
            catch (Exception ex)
            {
                functionReturnValue = "AAAAA";
                Console.WriteLine("Wrong Key Number, decryption not available!");
            }
            return functionReturnValue;
        }
    }
}
