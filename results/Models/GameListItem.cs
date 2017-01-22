using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Results.Models
{
    public class GameListItem
    {
        [JsonProperty("game_id")]
        public string GameId { get; set; }

        [JsonProperty("team_1")]
        public string Team1 { get; set; }

        [JsonProperty("team_2")]
        public string Team2 { get; set; }
    }
}
