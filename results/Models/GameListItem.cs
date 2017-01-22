
using Jil;

namespace Results.Models
{
    public class GameListItem
    {
        [JilDirective(Name="game_id")]
        public string GameId { get; set; }

        [JilDirective(Name="team_1")]
        public string Team1 { get; set; }

        [JilDirective(Name="team_2")]
        public string Team2 { get; set; }
    }
}
