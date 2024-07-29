import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../../models/brand';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private brandAddedSubject = new Subject<void>();
  brandAdded$ = this.brandAddedSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

   // Method to notify that the brand is added or updated
   public notifyBrandAdded(): void {
    this.brandAddedSubject.next();
  }

  public getBrands(): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>('http://localhost:3000/brands');
  }

  public getBrandById(id: string): Observable<Brand> {
    return this.httpClient.get<Brand>(`http://localhost:3000/brands/${id}`);
  }

  public addBrand(createBody: Brand) {
    return this.httpClient.post('http://localhost:3000/brands', createBody);
  }

  public updateBrand(id: string, updateBody: {name: string}) {
    return this.httpClient.put(`http://localhost:3000/brands/${id}`, updateBody);
  }

  public deleteBrand(id: string) {
    return this.httpClient.delete(`http://localhost:3000/brands/${id}`);
  }

  public searchBrand(searchValue: string) : Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(`http://localhost:3000/brands?name=${searchValue}`);
  }

}
