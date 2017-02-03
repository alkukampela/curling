using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net;
using Results.Models;
using Jil;

namespace Results.Controllers
{
    [Route("stones")]
    public class StonesController : Controller
    {
        [HttpGet("{gameId}")]
        public async Task<IActionResult> Get(string gameId)
        {
            try
            {
                Console.WriteLine("Game_ID: "+gameId);
                var stones = await this.FetchStones(gameId);
                return Helpers.GetJsonResult(stones);
            }
            catch (ArgumentException)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }
        }

        private async Task<dynamic> FetchStones(string gameId)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    var response = await DoRequest(client, "/data-service/stones/" + gameId);
                    var stringResponse = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(stringResponse);
                    return JSON.DeserializeDynamic(stringResponse);

                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e);
                    return new Game();
                }
            }
        }

        private async Task<HttpResponseMessage> DoRequest(HttpClient client, string endpoint) 
        {
            client.BaseAddress = new Uri(Constants.BASE_URL);
            return await client.GetAsync(endpoint);
        }

    }
}
