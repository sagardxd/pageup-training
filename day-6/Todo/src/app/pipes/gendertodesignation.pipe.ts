import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../models/todo.model';

@Pipe({
  name: 'gendertodesignation'
})
export class GendertodesignationPipe implements PipeTransform {

  transform(value: string, gender: Gender): string {
    if(gender == Gender.male) {
      return 'Mr. ' + value;
    }else{
      return 'Ms. ' + value;
    }
  }

}
