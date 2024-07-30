import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../models/todo.model';

@Pipe({
  name: 'enumtoname'
})
export class EnumtonamePipe implements PipeTransform {

  transform(value: Gender,enumType: typeof Gender): unknown {
    return enumType[value];
  }

}