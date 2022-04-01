import {colors} from "../constants/colors";

const getColor = (rate: number): string => {
    if (rate < 50) {
        return 'red'
    }
    if (rate >= 50 && rate < 75) {
        return colors.yellow
    }
    return 'green'
}
export default getColor