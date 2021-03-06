using System.Collections.Generic;
using Jil;

namespace Results.Models
{    
    public class Game
    {
        [JilDirective(Name="game_id")]
        public string GameId { get; set; }

        [JilDirective(Name="teams")]
        public Teams Teams { get; set; }

        [JilDirective(Name="stones_in_end")]
        public int StonesInEnd { get; set; }

        [JilDirective(Name="total_ends")]
        public int TotalEnds { get; set; }

        [JilDirective(Name="team_with_hammer")]
        public string TeamWithHammer { get; set; }

        [JilDirective(Name="delivery_turn")]
        public string DeliveryTurn { get; set; }

        [JilDirective(Name="stones_delivered")]
        public TeamIntPair StonesDelivered { get; set; }

        [JilDirective(Name="end_scores")]
        public IList<TeamIntPair> EndScores { get; set; }

        [JilDirective(Name="total_score")]
        public TeamIntPair TotalScore { get; set; }
    }

    public class Teams
    {

        [JilDirective(Name="team_1")]
        public string Team1 { get; set; }

        [JilDirective(Name="team_2")]
        public string Team2 { get; set; }
    }

    public class TeamIntPair {

        [JilDirective(Name="team_1")]
        public int Team1 { get; set; }

        [JilDirective(Name="team_2")]
        public int Team2 { get; set; }
    }
}
