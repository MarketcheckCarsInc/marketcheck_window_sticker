import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { EpiDecodeData, DealerApiResponse } from './api'


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private rootUrl = "https://marketcheck-prod.apigee.net/v2/";

  constructor(private https: HttpClient) { }

  getEpiDecodeData(vin: string, queryParams: Object){
    let params = new HttpParams();

    const url = this.rootUrl + `decode/car/epi/${vin}/specs`;
    
    if(Object.keys(queryParams).length > 0){
      for(var key of Object.keys(queryParams)){
        params = params.append(key, queryParams[key])
      }
    };
    return this.https.get<EpiDecodeData>(url, {params: params});
  }

  getDealerData(queryParams: Object){
    let params = new HttpParams();

    const url = this.rootUrl + `dealers/car`;
    
    if(Object.keys(queryParams).length > 0){
      for(var key of Object.keys(queryParams)){
        params = params.append(key, queryParams[key])
      }
    };
    return this.https.get<DealerApiResponse>(url, {params: params});
  }

}