using CMA.Common;
using CMA.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace CMA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly string _filePath = "contacts.json";
        readonly IConfiguration Configuration;
        private readonly AppConfig _appConfig;
        private readonly ILogger<ContactController> _logger;

        public ContactController(ILogger<ContactController> logger, IConfiguration setting, AppConfig appConfig)
        {
            _logger = logger;
            Configuration = setting;
            _appConfig = appConfig;
        }


        [HttpGet("GetContacts")]
        public IActionResult GetContacts()
        {
            // Initialize an empty list of contacts
            var contacts = new List<ContactDto>();

            // Read existing contacts from the JSON file
            if (System.IO.File.Exists(_filePath))
            {
                var jsonData = System.IO.File.ReadAllText(_filePath);
                contacts = System.Text.Json.JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
            }

            // Return the list of contacts
            return Ok(contacts);
        }
        [HttpGet("GetContactById")]
        public IActionResult GetContactById(int contactId)
        {
            var contacts = new List<ContactDto>();

            // Read existing contacts from the JSON file
            if (System.IO.File.Exists(_filePath))
            {
                var jsonData = System.IO.File.ReadAllText(_filePath);
                contacts = System.Text.Json.JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
            }

            // Find the contact with the specified ContactId
            var contact = contacts.FirstOrDefault(c => c.ContactId == contactId);

            if (contact == null)
            {
                return NotFound(new { Message = $"Contact with ID {contactId} not found." });
            }

            return Ok(contact);
        }
        [HttpPost("AddContact")]
        public IActionResult AddContact([FromBody] ContactDto newContact)
        {
            var contacts = new List<ContactDto>();

            // Read existing contacts from the JSON file
            if (System.IO.File.Exists(_filePath))
            {
                var jsonData = System.IO.File.ReadAllText(_filePath);
                contacts = System.Text.Json.JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
            }

            // Auto-increment the ContactId
            newContact.ContactId = contacts.Count > 0 ? contacts.Max(c => c.ContactId) + 1 : 1;

            // Add the new contact to the list
            contacts.Add(newContact);

            // Save the updated list back to the JSON file
            var updatedJsonData = System.Text.Json.JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_filePath, updatedJsonData);

            return Ok(newContact);
        }
        [HttpPut("UpdateContact")]
        public IActionResult UpdateContact([FromBody] ContactDto updatedContact)
        {
            var contacts = new List<ContactDto>();

            // Read existing contacts from the JSON file
            if (System.IO.File.Exists(_filePath))
            {
                var jsonData = System.IO.File.ReadAllText(_filePath);
                contacts = System.Text.Json.JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
            }

            // Find the contact by ID
            var contact = contacts.FirstOrDefault(c => c.ContactId == updatedContact.ContactId);
            if (contact == null)
            {
                return NotFound(new { Message = "Contact not found" });
            }

            // Update the contact details
            contact.FirstName = updatedContact.FirstName;
            contact.LastName = updatedContact.LastName;
            contact.Email = updatedContact.Email;

            // Save the updated list back to the JSON file
            var updatedJsonData = System.Text.Json.JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_filePath, updatedJsonData);

            return Ok(contact);
        }

        [HttpDelete("DeleteContact")]
        public IActionResult DeleteContact(int contactId)
        {
            var contacts = new List<ContactDto>();

            // Read existing contacts from the JSON file
            if (System.IO.File.Exists(_filePath))
            {
                var jsonData = System.IO.File.ReadAllText(_filePath);
                contacts = System.Text.Json.JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
            }

            // Find the contact by ID
            var contact = contacts.FirstOrDefault(c => c.ContactId == contactId);
            if (contact == null)
            {
                return NotFound(new { Message = "Contact not found" });
            }

            // Remove the contact from the list
            contacts.Remove(contact);

            // Save the updated list back to the JSON file
            var updatedJsonData = System.Text.Json.JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_filePath, updatedJsonData);

            return Ok(new { Message = "Contact deleted successfully" });
        }


        [HttpPost]
        public async Task<IActionResult> ValidateUserAndGetToken(UserInfo userCredential)
        {
            if (string.IsNullOrEmpty(userCredential.Email) || string.IsNullOrEmpty(userCredential.Password))
            {
                return Ok(new
                {
                    Status = false,
                    Message = "NotExists"
                });
            }

            var token = GenerateJwtToken(userCredential.Email);
            TokenDto responseObj = new TokenDto(); 
            responseObj.token = token.Item1; 
            responseObj.expiresIn = getDateTimeInSpecficFormat(token.Item2);

            return Ok(new
            {
                Status = true,
                Message = "Success",
                Result = userCredential,
                TokenResult = responseObj
            });
        }

        public (string, DateTime, List<Claim>) GenerateJwtToken(string emailId)
        {
            var securityKey = Configuration["G9-JWT:SecretKey"];
            var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(securityKey));
         
            var credentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256);

            var tokenIssuer = Configuration["G9-JWT:Issuer"];
            var tokenAudience = Configuration["G9-JWT:Audience"];

            var claims = new List<Claim>
                    {
                         
                        new Claim(ClaimTypes.Email, emailId) 
                        
                    };

            DateTime expiry = DateTime.UtcNow.AddMinutes(_appConfig.Expiry);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: expiry,
                issuer: tokenIssuer,
                audience: tokenAudience,
                signingCredentials: credentials);

            return (new JwtSecurityTokenHandler().WriteToken(token), expiry, claims);
        }
        [NonAction]
        private string getDateTimeInSpecficFormat(DateTime dateTime)
        {
            return dateTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss");
        }
    }
}
