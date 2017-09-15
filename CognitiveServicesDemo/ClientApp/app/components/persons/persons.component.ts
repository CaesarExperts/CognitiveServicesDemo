import { Component, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

@Component({
    selector: 'persons',
    templateUrl: './persons.component.html'
})
export class PersonsComponent {
    public groups: PersonGroup[];
    public persons: Person[];
    public verifyResult: VerifyResult;
    public faces: Face[];

    public addPersonGroupId: string;
    public addPersonName: string;
    public addPersonImageUrl: string;

    public personGroupId: string;
    public personId: string;
    public imageUrl: string;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        let url = this.baseUrl + "api/Face/persongroups";
        this.http.get(url).map((res) => {
            this.groups = res.json();
        }).subscribe();
    }

    public findPersons(personGroupId: string) {
        let url = this.baseUrl + `api/Face/persongroups/${personGroupId}/persons`;

        this.http.get(url).map((res) => {
            this.persons = res.json();
        }).subscribe();
    }

    public verify() {
        let detectUrl = `api/Face/detect?imageUrl=${this.imageUrl}`;
        this.http.post(detectUrl, null).map((res) => {
            this.faces = res.json();
        }).subscribe(() => {
            let url = this.baseUrl + `api/Face/persongroups/${this.personGroupId}/persons/${this.personId}/verifyface/${this.faces[0].faceId}`;

            this.http.post(url, null).map((res) => {
                this.verifyResult = res.json();
            }).subscribe();
        });
    }

    public addPerson() {
        let personId = "";

        let detectUrl = this.baseUrl + `api/Face/persongroups/${this.addPersonGroupId}/persons/create/${this.addPersonName}`;
        this.http.post(detectUrl, null).map((res) => {
            personId = res.text();
        }).subscribe(() => {

            var inp = document.getElementById('imageFile') as any;
            let fileList: FileList = inp.Files;
            if (fileList != null && fileList.length > 0) {

                let file: File = fileList[0];
                let formData: FormData = new FormData();
                formData.append('uploadFile', file, file.name);
                let headers = new Headers()
                let options = new RequestOptions({ headers: headers });
                let addFaceUrl = this.baseUrl + `api/Face/persongroups/${this.addPersonGroupId}/persons/${personId}/addface`;

                this.http.post(addFaceUrl, formData, options).map((res) => {
                    let faceId = res.text();
                }).subscribe();
            } else if (this.addPersonImageUrl != null) {
                let addFaceUrl = this.baseUrl + `api/Face/persongroups/${this.addPersonGroupId}/persons/${personId}/addface?imageUrl=${this.addPersonImageUrl}`;
                this.http.post(addFaceUrl, null).map((res) => {
                    let faceId = res.text();
                }).subscribe();
            }
        })
    }
}

interface PersonGroup {
    personGroupId: string;
    name: string;
    userData: string;
}

interface Person {
    personId: string;
    persistedFaceIds: string[];
    name: string;
    userData: string;
}

interface VerifyResult {
    isIdentical: boolean;
    confidence: number;
}

interface Face {
    faceId: string;
}