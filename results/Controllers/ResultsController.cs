using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net;
using Results.Models;
using Jil;
using Jil.DeserializeDynamic;

namespace Results.Controllers
{
    [Route("")]
    public class ResultsController : Controller
    {
        private const string BASE_URL = "http://gateway:8888";
        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var games = await this.FetchGames();
            return GetJsonResult(games);
        }

        [HttpGet("{gameId}")]
        public async Task<IActionResult> Get(string gameId)
        {
            try
            {
                var game = await this.FetchGame(gameId);
                return GetJsonResult(game);
            }
            catch (ArgumentException)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }
        }

        private async Task<IList<GameListItem>> FetchGames()
        {
            var games = new List<GameListItem>();
            using (var client = new HttpClient())
            {
                try
                {
                    var response = await DoRequest(client, "/data-service/games");
                    var stringResponse = await response.Content.ReadAsStringAsync();

                    var gamesJson = JSON.DeserializeDynamic(stringResponse);

                    foreach (var item in gamesJson)
                    {
                        games.Add(new GameListItem{
                            GameId = item["game_id"],
                            Team1 = item["teams"]["team_1"],
                            Team2 = item["teams"]["team_2"]
                        });
                    }

                    return games;
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e);
                    return games;
                }
            }
        }

        private async Task<Game> FetchGame(string gameId)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    var response = await DoRequest(client, "/data-service/games/" + gameId);
                    if (response.IsSuccessStatusCode)
                    {
                        var stringResponse = await response.Content.ReadAsStringAsync();
                        return JSON.Deserialize<Game>(stringResponse);
                    }
                    else
                    {
                        throw new ArgumentException("Invalid gameId " + gameId);
                    }
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
            client.BaseAddress = new Uri(BASE_URL);
            return await client.GetAsync(endpoint);
        }


        private static ContentResult GetJsonResult(object value)
        {
            return new ContentResult {
                Content = JSON.Serialize(value),
                ContentType = "application/json"
            };
        }
    }
}
