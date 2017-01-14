using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Newtonsoft.Json;

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

namespace results.Controllers
{
    // Dummy class for random test api
    class UserModel
    {
        public int id { get; set; }
        public string name { get; set; }

        public string username { get; set; }
    }

    class GameModel
    {
        public string Game_id { get; set; }
        public string Team_1 { get; set; }

        public string Team_2 { get; set; }
    }

    [Route("")]
    public class ResultsController : Controller
    {
        const string API_ENDPOINT = "https://jsonplaceholder.typicode.com";

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var games = new List<GameModel>();

            foreach (UserModel user in await this.FetchGames())
            {
                var game = new GameModel()
                {
                    Game_id = user.id.ToString(),
                    Team_1 = user.name,
                    Team_2 = user.username
                };
                games.Add(game);
            }

            return Json(games);
        }

        private async Task<IList<UserModel>> FetchGames()
        {
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(API_ENDPOINT);
                    var response = await client.GetAsync("/users");
                    var stringResponse = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<UserModel>>(stringResponse);
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e);
                    return new List<UserModel>();
                }
            }
        }

        [HttpGet("{gameId}")]
        public async Task<IActionResult> Get(string gameId)
        {
            var user = await this.FetchGame(gameId);
            var game = new GameModel()
            {
                Game_id = user.id.ToString(),
                Team_1 = user.name,
                Team_2 = user.username
            };
            return Json(game);
        }

        private async Task<UserModel> FetchGame(string gameId)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(API_ENDPOINT);
                    var response = await client.GetAsync("/users/" + gameId);
                    var stringResponse = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<UserModel>(stringResponse);
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e);
                    return new UserModel();
                }
            }
        }
    }
}