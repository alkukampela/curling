using Jil;
using Microsoft.AspNetCore.Mvc;

public static class Helpers
{
    public static ContentResult GetJsonResult(object value)
    {
        return new ContentResult {
            Content = JSON.Serialize(value),
            ContentType = "application/json"
        };
    }
}