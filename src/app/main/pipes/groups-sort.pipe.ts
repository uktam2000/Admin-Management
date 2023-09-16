import { Pipe, PipeTransform } from "@angular/core";
import { Groups } from "../models/system.model";

@Pipe({
    name:'sortGroups',
})
export class GroupSortPipe implements PipeTransform{
    transform(value:Groups[]):Groups[] {
        return value.sort((a, b)=>{
            return  a.id - b.id ;   
        })
    }
}