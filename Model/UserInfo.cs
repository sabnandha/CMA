namespace CMA.Model
{
    public class UserInfo
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class TokenDto
    {
        public string token { get; set; } 
        public string expiresIn { get; set; }
    }

}
