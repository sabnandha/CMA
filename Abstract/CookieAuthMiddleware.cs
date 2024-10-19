using Newtonsoft.Json;

namespace WebcassE.Reports.WebApi.Abstract
{
    public class CookieAuthMiddleware
    {

        private readonly RequestDelegate _next;
        private readonly ILogger<CookieAuthMiddleware> _logger; 
        public CookieAuthMiddleware(RequestDelegate next,
            ILogger<CookieAuthMiddleware> logger)
        {
            _next = next;
            _logger = logger; 
        }

        public async Task Invoke(HttpContext context)
        {
            String errorMessage = string.Empty;
            try
            {
                var Reqtoken = context.Request.Headers["Authorization"];

                if (!string.IsNullOrEmpty(Reqtoken))
                {
                    context.Request.Headers.Remove("Authorization"); 
                    string auth = Reqtoken.ToString().Replace("Bearer ", "").ToString(); 
                    context.Request.Headers.Add("Authorization", "Bearer " + auth);
                } 
                await _next(context);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                errorMessage = $"Message : {ex.Message} , InnerException : {ex.InnerException}";
               // var userName = context.User.Identity.Name;
              //  var userEmail = context.User.Claims.FirstOrDefault(x => x.Type.Contains("emailaddress"));
                var ipAddress = context.Connection.RemoteIpAddress.MapToIPv4();
                var ipv6 = context.Connection.RemoteIpAddress.MapToIPv6();
                string sessionMessage =  "Custom Exception Message: Session got expired ";
                string message1 = $"Middleware. we are getting some exception, {sessionMessage} Exception message: {ex.Message}, Inner exception: {ex.InnerException?.Message ?? ""} , Stacktrace: {ex.StackTrace ?? ""}";
                var message = Environment.NewLine + "Request from Remote IP address IPv4 : " + ipAddress + " IPv6: " + ipv6 + Environment.NewLine +
                          Environment.NewLine + "Uri : " + context.Request.Path.ToString() +
                          Environment.NewLine + "Method : " + context.Request.Method +
                          Environment.NewLine + "Controller : " + context.Request.RouteValues["controller"]?.ToString() +
                          Environment.NewLine + "Action : " + context.Request.RouteValues["action"]?.ToString() +
                          Environment.NewLine + message1 + Environment.NewLine + Environment.NewLine;
            }
            finally
            {
               
                if (context.Response.StatusCode == 401 && context.Request.Path.Value != "/api/Account/RefreshToken")
                {
                    _logger.LogError("Middleware. we are getting some 401 unauthorized ....");
                    var userEmail = context.Request.Headers.FirstOrDefault(item => item.Key == "email").Value;
                    _logger.LogError("Middleware 401 unauthorized URL: {url}, User email: {userEmail}", context.Request.Path, userEmail);
                }
                if (!context.Response.HasStarted && context.Response.StatusCode == 500)
                {
                    context.Response.ContentType = "application/json";
                    var response = new { StatusText = "Internal server error.", Error = errorMessage };
                    _logger.LogError(errorMessage);
                    var json = JsonConvert.SerializeObject(response);
                    await context.Response.WriteAsync(json);
                }
                if (context.Response.StatusCode == 404)
                {
                    _logger.LogError("Middleware. A 404 not found error occurred...");
                    var requestedPath = context.Request.Path.Value;
                    _logger.LogError("Middleware 404 Not Found URL: {url}", requestedPath);

                    // Optionally, set a custom response message
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        StatusCode = 404,
                        Message = "The resource you are looking for was not found.",
                        RequestedUrl = requestedPath
                    }));
                }
            }
        }
    }
}
