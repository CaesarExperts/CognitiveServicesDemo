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

    public onSubmit() {
        let detectUrl = `api/Face/detect?imageUrl=${this.imageUrl}`;
        this.http.post(detectUrl, null).map((res) => {
            this.faces = res.json();
        }).subscribe(() => {
            let url = this.baseUrl + `api/Face/persongroups/${this.personGroupId}/persons/${this.personId}/verifyface/${this.faces[0].faceId}`;

            this.http.post(url, null).map((res) => {
                this.verifyResult = res.json();
            }).subscribe();
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