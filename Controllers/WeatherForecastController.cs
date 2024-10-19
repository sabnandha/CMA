using CMA.Modal;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CMA.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly string _filePath = "contacts.json";
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
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
                contacts = JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
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
                contacts = JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
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
                contacts = JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
            }

            // Auto-increment the ContactId
            newContact.ContactId = contacts.Count > 0 ? contacts.Max(c => c.ContactId) + 1 : 1;

            // Add the new contact to the list
            contacts.Add(newContact);

            // Save the updated list back to the JSON file
            var updatedJsonData = JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
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
                contacts = JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
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
            var updatedJsonData = JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
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
                contacts = JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
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
            var updatedJsonData = JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_filePath, updatedJsonData);

            return Ok(new { Message = "Contact deleted successfully" });
        }
        
      
    }
}