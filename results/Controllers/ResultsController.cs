using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace results.Controllers
{
    [Route("api/[controller]")]
    public class ResultsController : Controller
    {
        [HttpGet]
        public string Get()
        {
            return "Sorry, no results";
        }

        [HttpGet("{gameId}")]
        public string Get(string gameId)
        {
            return String.Format("Got, {0}", gameId);
        }
    }
}