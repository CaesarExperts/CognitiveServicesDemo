using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Cognitive.CustomVision;
using Microsoft.AspNetCore.Http;
using Microsoft.Cognitive.CustomVision.Models;
using System.Net.Http;
using System.IO;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace CognitiveServicesDemo.Controllers
{
    [Route("api/[controller]")]
    public class CustomVisionController : Controller
    {
        [HttpPost]
        [Route("Predict")]
        public async Task<IEnumerable<ImageTagPrediction>> UploadJsonFile()
        {
            var files = HttpContext.Request.Form.Files;
            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    using (var stream = file.OpenReadStream())
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            stream.CopyTo(ms);

                            var client = new HttpClient();

                            // Request headers - replace this example key with your valid subscription key.
                            client.DefaultRequestHeaders.Add("Prediction-Key", "cf1af57d58c346818a0f55b34c5e5e68");

                            // Prediction URL - replace this example URL with your valid prediction URL.
                            string url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/732425f6-2374-4479-9ccd-c2038aa1f854/image?iterationId=85312f23-1627-45af-8b32-40d0ffe111b9";

                            HttpResponseMessage response;

                            using (var content = new ByteArrayContent(ms.ToArray()))
                            {
                                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                                response = await client.PostAsync(url, content);
                                string resContent = await response.Content.ReadAsStringAsync();
                                var model = JsonConvert.DeserializeObject<ImagePredictionResultModel>(resContent);
                                return model.Predictions;
                            }
                        }
                    }
                }
            }
            return null;
        }
    }
}
