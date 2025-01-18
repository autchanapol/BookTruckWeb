namespace BookTruckWeb.fuc
{
    using MailKit.Net.Smtp;
    using MimeKit;

    public class EmailSender
    {
        private readonly string _smtpServer;
        private readonly int _port;
        private readonly string _fromEmail;
        private readonly string _password;

        public EmailSender(string smtpServer, int port, string fromEmail, string password)
        {
            _smtpServer = smtpServer;
            _port = port;
            _fromEmail = fromEmail;
            _password = password;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Sender Name", _fromEmail));
            message.To.Add(new MailboxAddress("Recipient Name", toEmail));
            message.Subject = subject;

            message.Body = new TextPart("plain")
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_smtpServer, _port, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_fromEmail, _password);
                    await client.SendAsync(message);
                    Console.WriteLine("Email sent successfully!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");
                }
                finally
                {
                    await client.DisconnectAsync(true);
                }
            }
        }
    }
}
