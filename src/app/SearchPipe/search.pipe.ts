import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  
  transform(value: any[], args: string, filterMetadata: any): any[] {
    if (!value) return [];
    if (!args) {
      filterMetadata.count = value.length;
      return value;
    }
    let filteredItemss = value.filter(function (item: any) {
      return JSON.stringify(item)
        .toUpperCase()
        .includes(args.toUpperCase());
    });
    debugger;
    filterMetadata.count = filteredItemss.length;
    return filteredItemss;

  }

}
