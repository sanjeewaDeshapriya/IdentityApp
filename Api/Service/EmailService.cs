using Api.Dto.Account;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq.Expressions;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Api.Service
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendEmailAsync(EmailSendDto emailsend) {




            try {

                var username = "";
            var password = "";

            var client =  new SmtpClient("smtp-mail.outlook.com", 587)
            {
                Credentials = new System.Net.NetworkCredential(username, password),
                EnableSsl = true
            };

            var message = new MailMessage
            (from: username, to: emailsend.To,
                subject: emailsend.Subject,
                body: emailsend.Body);

            message.IsBodyHtml = true;
            await client.SendMailAsync(message);
            return true;
            
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error sending email: {ex.Message}");
                return false;
            }
            
        }
    }
}
