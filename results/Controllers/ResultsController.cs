using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using Results.Models;

// api/results
// [
//     {
//         "game_id": "492dda052473",
//         "team_1": "Sorsa-Sepot",
//         "team_2": "Paha-Kalevit"
//     },
//     {
//         "game_id": "a90ddba4b735",
//         "team_1": "Hermorauniot",
//         "team_2": "Luu-5"
//     },
//     {
//         "game_id": "810c97fa295c",
//         "team_1": "Jääkenttien Kuninkaat",
//         "team_2": "Luudankylväjät"
//     }
// ]

// api/results/{gameId}
// {
//     "game_id": "86b1474",
//     "teams": {
//         "team_1": "Sorsa-Sepot",
//         "team_2": "Paha-Kalevit"
//     },
//     "stones_in_end": 5,
//     "total_ends": 4,
//     "stones_thrown": {
//         "team_1": 0,
//         "team_2": 0
//     },
//     "end_scores": []
// }

namespace Results.Controllers
{
    class TeamModel
    {
        public string Team_1 { get; set; }

        public string Team_2 { get; set; }
    }

    class StonesThrownModel
    {
        public int Team_1 { get; set; }

        public int Team_2 { get; set; }
    }

    class GameModel
    {
        public string Game_id { get; set; }

        public TeamModel Teams { get; set; }

        public int Stones_in_end { get; set; }

        public int total_ends { get; set; }

        public StonesThrownModel Stones_thrown { get; set; }

        public IList<int> End_scores { get; set; }
    }



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
            
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(BASE_URL);
                    var response = await client.GetAsync("/data-service/games");
                    var stringResponse = await response.Content.ReadAsStringAsync();
                    var games = JsonConvert.DeserializeObject<List<GameModel>>(stringResponse);

                    return games
                        .Select(game => new GameListItem{
                            Game_id = game.Game_id,
                            Team_1 = game.Teams.Team_1,
                            Team_2 = game.Teams.Team_2
                        }).ToList();
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e);
                    return new List<GameListItem>();
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

        private async Task<GameModel> FetchGame(string gameId)
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
                        return JsonConvert.DeserializeObject<GameModel>(stringResponse);
                    }
                    else
                    {
                        throw new ArgumentException("Invalid gameId " + gameId);
                    }
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e);
                    return new GameModel();
                }
            }
        }
    }
}