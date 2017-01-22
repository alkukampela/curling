using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Results.Models;
using Jil;
using Jil.DeserializeDynamic;


namespace Results.Controllers
{

    [Route("")]
    public class ResultsController : Controller
    {
        private const string BASE_URL = "http://gateway";
        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var games = await this.FetchGames();
            return Json(games);
        }

        private async Task<IList<GameListItem>> FetchGames()
        {
            var games = new List<GameListItem>();
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(BASE_URL);
                    var response = await client.GetAsync("/data-service/games");
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

        [HttpGet("{gameId}")]
        public async Task<IActionResult> Get(string gameId)
        {
            try
            {
                var game = await this.FetchGame(gameId);
                return Json(game);
            }
            catch (ArgumentException)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }
        }

        private async Task<Game> FetchGame(string gameId)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(BASE_URL);
                    var response = await client.GetAsync("/data-service/games/" + gameId);
                    if (response.IsSuccessStatusCode)
                    {
                        var stringResponse = await response.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<Game>(stringResponse);
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
    }
}