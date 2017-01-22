using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Results.Models
{    
    public class Game
    {
        [JsonProperty("game_id")]
        public string GameId { get; set; }

        public Teams Teams { get; set; }

        [JsonProperty("stones_in_end")]
        public int StonesIEnd { get; set; }

        [JsonProperty("total_ends")]
        public int TotalEnds { get; set; }

        [JsonProperty("stones_delivered")]
        public StonesDelivered StonesDelivered { get; set; }

        [JsonProperty("end_scores")]
        public IList<EndScore> EndScores { get; set; }
    }

    public class Teams
    {
        [JsonProperty("team_1")]
        public string Team1 { get; set; }

        [JsonProperty("team_2")]
        public string Team2 { get; set; }
    }

    public class StonesDelivered
    {
        [JsonProperty("team_1")]
        public int Team1 { get; set; }

        [JsonProperty("team_2")]
        public int Team_2 { get; set; }
    }

    public class EndScore {

        [JsonProperty("team_1")]
        public int Team1 { get; set; }

        [JsonProperty("team_2")]
        public int Team_2 { get; set; }
    }
}
