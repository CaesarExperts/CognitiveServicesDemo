using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ProjectOxford.Face;
using Microsoft.ProjectOxford.Face.Contract;

namespace CognitiveServicesDemo.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class FaceController : Controller
    {
        private FaceServiceClient faceClient;

        public FaceController()
        {
            faceClient = new FaceServiceClient("fb9c9adb7bae49bba1af60643741a031", "https://westeurope.api.cognitive.microsoft.com/face/v1.0");
        }

        [Route("api/[controller]/persongroups")]
        [HttpGet]
        public async Task<PersonGroup[]> GetPersonGroups()
        {
            return await faceClient.ListPersonGroupsAsync();
        }

        [Route("api/[controller]/persongroups/create")]
        [HttpPost]
        public async Task CreatePersonGroupAsync(string personGroupId, string name)
        {
            await faceClient.CreatePersonGroupAsync(personGroupId, name);
        }

        [Route("api/[controller]/persongroups/{personGroupId}")]
        [HttpGet]
        public async Task<PersonGroup> GetPersonGroups(string personGroupId)
        {
            return await faceClient.GetPersonGroupAsync(personGroupId);
        }

        [Route("api/[controller]/persongroups/{personGroupId}/persons")]
        [HttpGet]
        public async Task<Person[]> GetPersonsAsync(string personGroupId)
        {
            return await faceClient.ListPersonsAsync(personGroupId);
        }

        [Route("api/[controller]/persongroups/{personGroupId}/persons/create")]
        [HttpPost]
        public async Task<string> CreatePersonAsync(string personGroupId, string name)
        {
            CreatePersonResult res = await faceClient.CreatePersonAsync(personGroupId, name);
            return res.PersonId.ToString();
        }

        [Route("api/[controller]/persongroups/{personGroupId}/persons/{personId}")]
        [HttpGet]
        public async Task<Person> GetPersonAsync(string personGroupId, string personId)
        {
            return await faceClient.GetPersonAsync(personGroupId, new Guid(personId));
        }

        [Route("api/[controller]/persongroups/{personGroupId}/persons/{personId}/addface")]
        [HttpPost]
        public async Task<string> GetPersonsAsync(string personGroupId, string personId, string imageUrl)
        {
            AddPersistedFaceResult res = await faceClient.AddPersonFaceAsync(personGroupId, new Guid(personId), imageUrl);
            return res.PersistedFaceId.ToString();
        }

        [Route("api/[controller]/persongroups/{personGroupId}/persons/{personId}/verifyface/{faceId}")]
        [HttpPost]
        public async Task<VerifyResult> VerifyPersonAsync(string personGroupId, string personId, string faceId)
        {
            VerifyResult res = await faceClient.VerifyAsync(new Guid(faceId), personGroupId, new Guid(personId));
            return res;
        }

        [Route("api/[controller]/detect")]
        [HttpPost]
        public async Task<Face[]> DetectAsync(string imageUrl)
        {
            Face[] faces = await faceClient.DetectAsync(imageUrl);
            return faces;
        }
    }
}