import { Component, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

@Component({
    selector: 'predict',
    templateUrl: './predict.component.html'
})
export class PredictComponent {
    public tags: Tag[];

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
    }

    public fileChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers()
            let options = new RequestOptions({ headers: headers });
            let apiUrl1 = this.baseUrl + "api/CustomVision/Predict";

            this.http.post(apiUrl1, formData, options)
                .map(res => {
                    this.tags = res.json()
                }).catch(error => Observable.throw(error))
                     .subscribe(data => console.log('success'), error => console.log(error))
        }
    }
}

interface Tag {
    tagId: string;
    tag: string;
    probability: number;
}