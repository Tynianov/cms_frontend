export default {
    filters: {
        decimalToRepresentation(val){
            let decimalPart = val.toString().split('.')[1];
            let str = Math.trunc(val).toString();
            for (let i = str.length - 3; i >= 0; i-=3){
                if (i){
                    str = str.slice(0, i) + ',' + str.slice(i)
                }
            }
            if (decimalPart)
                return str + '.'+ decimalPart
            return str
        }
    }
}