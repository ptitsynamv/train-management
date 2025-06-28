import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToText',
})
export class BooleanToTextPipe implements PipeTransform {
  transform(
    value: boolean,
    trueText: string = 'Yes',
    falseText: string = 'No'
  ): string {
    return value ? trueText : falseText;
  }
}
